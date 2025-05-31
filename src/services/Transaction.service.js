const { BadRequestError, InternalServerError } = require("../core/error");
const { executeQuery } = require("../database/executeQuery");

class TransactionService {
  getTransaction = async (payload) => {
    const {
      limit,
      page,
      employee,
      partner,
      startTime,
      endTime,
      product_name,
      manufacturer,
      category_name,
      action,
    } = payload;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    if (
      isNaN(parsedLimit) ||
      isNaN(parsedPage) ||
      parsedLimit <= 0 ||
      parsedPage <= 0
    ) {
      throw new BadRequestError("Limit và page phải là số nguyên dương!");
    }
    const offset = (parsedPage - 1) * parsedLimit;
    let addQuery = "";
    const params = [];

    if (employee) {
      addQuery += " AND e.name LIKE ?";
      params.push(`%${employee}%`);
    }
    if (partner) {
      addQuery += " AND p.name LIKE ?";
      params.push(`%${partner}%`);
    }
    if (product_name) {
      addQuery += " AND pr.name LIKE ?";
      params.push(`%${product_name}%`);
    }
    if (manufacturer) {
      addQuery += " AND m.name LIKE ?";
      params.push(`%${manufacturer}%`);
    }
    if (category_name) {
      addQuery += " AND c.name LIKE ?";
      params.push(`%${category_name}%`);
    }

    if (action && ["import", "export"].includes(action)) {
      addQuery += " AND th.action = ?";
      params.push(action);
    }

    if (startTime) {
      addQuery += " AND th.created_at >= ?";
      params.push(startTime);
    }
    if (endTime) {
      addQuery += " AND th.created_at <= ?";
      params.push(endTime);
    }

    let query = `
            SELECT 
        th.header_id,
        th.action,
        th.total_amount,
        th.created_at,
        th.notes,
        p.name AS partner_name,
        e.name AS employee_name,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'item_id', ti.item_id,
              'category', c.name,
              'quantity', ti.quantity,
              'manufacturer', m.name,
              'product_name', pr.name,
              'price_per_unit', ti.price_per_unit_snapshot,
              'total', (ti.quantity * ti.price_per_unit_snapshot)
            )
          ),
          JSON_ARRAY()
        ) AS items
      FROM transaction_headers th
        LEFT JOIN partners p ON th.partner_id = p.partner_id
        LEFT JOIN employees e ON th.employee_id = e.employee_id
        LEFT JOIN transaction_items ti ON th.header_id = ti.header_id
        LEFT JOIN stock s ON ti.stock_id = s.stock_id
        LEFT JOIN products pr ON s.product_id = pr.product_id
        LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
        LEFT JOIN categories c ON s.category_id = c.category_id
      WHERE 1=1
        AND s.is_deleted = FALSE 
        AND pr.is_deleted = FALSE 
        AND m.is_deleted = FALSE 
        AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
        ${addQuery}
      GROUP BY th.header_id, th.action, th.total_amount, th.created_at, th.notes, p.name, e.name
      ORDER BY th.created_at DESC
            LIMIT ${parsedLimit} OFFSET ${offset}
        `;

    let countQuery = `
            SELECT COUNT(DISTINCT th.header_id) AS total
            FROM transaction_headers th
                LEFT JOIN partners p ON th.partner_id = p.partner_id
                LEFT JOIN employees e ON th.employee_id = e.employee_id
                LEFT JOIN transaction_items ti ON th.header_id = ti.header_id
                LEFT JOIN stock s ON ti.stock_id = s.stock_id
                LEFT JOIN products pr ON s.product_id = pr.product_id
                LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE 1=1
                AND s.is_deleted = FALSE AND pr.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
                ${addQuery}
        `;

    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;
    const results = await executeQuery(query, params);

    results.forEach((result) => {
      console.log(
        "items before processing:",
        result.items,
        typeof result.items
      ); // Debug
      if (result.items) {
        if (typeof result.items === "string") {
          try {
            result.items = JSON.parse(result.items);
          } catch (error) {
            console.error(
              `Error parsing items JSON for header_id ${result.header_id}:`,
              error.message
            );
            result.items = [];
          }
        } else if (!Array.isArray(result.items)) {
          console.warn(
            `Items is not an array for header_id ${result.header_id}:`,
            result.items
          );
          result.items = [];
        }
      } else {
        result.items = [];
      }
    });

    return {
      total: total,
      totalPage: Math.ceil(total / parsedLimit),
      page: parsedPage,
      limit: parsedLimit,
      data: results,
    };
  };

  searchTransaction = async (payload, query) => {
    const { limit, page } = query;
    const { search } = payload;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    if (
      isNaN(parsedLimit) ||
      isNaN(parsedPage) ||
      parsedLimit <= 0 ||
      parsedPage <= 0
    ) {
      throw new BadRequestError("Limit và page phải là số nguyên dương!");
    }
    const offset = (parsedPage - 1) * parsedLimit;

    const searchQuery = `
            SELECT 
                th.header_id,
                th.action,
                th.total_amount,
                th.created_at,
                th.notes,
                p.name AS partner_name,
                e.name AS employee_name,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'item_id', ti.item_id,
                        'category', c.name,
                        'quantity', ti.quantity,
                        'manufacturer', m.name,
                        'product_name', pr.name,
                        'price_per_unit', ti.price_per_unit_snapshot,
                        'total', (ti.quantity * ti.price_per_unit_snapshot)
                    )
                ) as items
            FROM transaction_headers th
                LEFT JOIN partners p ON th.partner_id = p.partner_id
                LEFT JOIN employees e ON th.employee_id = e.employee_id
                LEFT JOIN transaction_items ti ON th.header_id = ti.header_id
                LEFT JOIN stock s ON ti.stock_id = s.stock_id
                LEFT JOIN products pr ON s.product_id = pr.product_id
                LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE 
                (p.name LIKE ? OR e.name LIKE ? OR pr.name LIKE ? OR m.name LIKE ? OR c.name LIKE ?)
                AND s.is_deleted = FALSE AND pr.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
            GROUP BY th.header_id, th.action, th.total_amount, th.created_at, th.notes, p.name, e.name
            ORDER BY th.created_at DESC
            LIMIT ${parsedLimit} OFFSET ${offset}
        `;

    const countQuery = `
            SELECT COUNT(DISTINCT th.header_id) AS total
            FROM transaction_headers th
                LEFT JOIN partners p ON th.partner_id = p.partner_id
                LEFT JOIN employees e ON th.employee_id = e.employee_id
                LEFT JOIN transaction_items ti ON th.header_id = ti.header_id
                LEFT JOIN stock s ON ti.stock_id = s.stock_id
                LEFT JOIN products pr ON s.product_id = pr.product_id
                LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE 
                (p.name LIKE ? OR e.name LIKE ? OR pr.name LIKE ? OR m.name LIKE ? OR c.name LIKE ?)
                AND s.is_deleted = FALSE AND pr.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
        `;

    const searchParams = [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ];

    const countResult = await executeQuery(countQuery, searchParams);
    const total = countResult[0].total;
    const results = await executeQuery(searchQuery, searchParams);

    results.forEach((result) => {
      if (result.items) {
        try {
          result.items = JSON.parse(result.items);
        } catch (error) {
          console.error("Error parsing items JSON:", error);
          result.items = [];
        }
      } else {
        result.items = [];
      }
    });

    return {
      total: total,
      totalPage: Math.ceil(total / parsedLimit),
      page: parsedPage,
      limit: parsedLimit,
      data: results,
    };
  };

  totalTransactionsToday = async () => {
    const query = `
            SELECT COUNT(DISTINCT th.header_id) AS total_transactions
            FROM transaction_headers th
            LEFT JOIN transaction_items ti ON th.header_id = ti.header_id
            LEFT JOIN stock s ON ti.stock_id = s.stock_id
            LEFT JOIN products pr ON s.product_id = pr.product_id
            LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE DATE(th.created_at) = CURDATE()
            AND s.is_deleted = FALSE AND pr.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL);
        `;
    const result = await executeQuery(query);
    return result[0].total_transactions;
  };

  getTransactionQuantityStatsLast12Months = async () => {
    const query = `
            SELECT 
                DATE_FORMAT(th.created_at, '%Y-%m') AS month,
                COALESCE(SUM(CASE WHEN th.action = 'import' THEN ti.quantity END), 0) AS import_quantity,
                COALESCE(SUM(CASE WHEN th.action = 'export' THEN ti.quantity END), 0) AS export_quantity
            FROM transaction_headers th
            JOIN transaction_items ti ON th.header_id = ti.header_id
            LEFT JOIN stock s ON ti.stock_id = s.stock_id
            LEFT JOIN products pr ON s.product_id = pr.product_id
            LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE th.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            AND s.is_deleted = FALSE AND pr.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
            GROUP BY DATE_FORMAT(th.created_at, '%Y-%m')
            ORDER BY month DESC;
        `;
    const result = await executeQuery(query);
    return result;
  };

  getTodayCount = async () => {
    const query = `
            SELECT COUNT(DISTINCT th.header_id) AS total_transactions
            FROM transaction_headers th
            LEFT JOIN transaction_items ti ON th.header_id = ti.header_id
            LEFT JOIN stock s ON ti.stock_id = s.stock_id
            LEFT JOIN products pr ON s.product_id = pr.product_id
            LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE DATE(th.created_at) = CURDATE()
            AND s.is_deleted = FALSE AND pr.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL);
        `;
    const result = await executeQuery(query);
    return result[0].total_transactions;
  };
}

module.exports = new TransactionService();
