import { useState, useEffect, useRef } from 'react';
import { fetchStock } from '@/lib/api/stock';
import { toast } from 'sonner';
import { searchEmployees } from '@/lib/api/employee';

export function useStockData(initialData) {
  const [currentData, setCurrentData] = useState(initialData.data || []);
  const [totalPages, setTotalPages] = useState(initialData.totalPage || 0);
  const [totalRecords, setTotalRecords] = useState(initialData.totalItem || 0);
  const [currentPage, setCurrentPage] = useState(initialData.page || 1);
  const [searchText, setSearchText] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceExportRange, setPriceExportRange] = useState([0, 100000]);
  const [priceImportRange, setPriceImportRange] = useState([0, 100000]);
  const [quantityRange, setQuantityRange] = useState([0, 1000]);
  const [productFilter, setProductFilter] = useState('');
  const [products, setProducts] = useState([]);
  

  const currentFilter = {
    product_name: searchText,
    manufacturer: manufacturerFilter,
    category_name: categoryFilter,
    priceExportMin: priceExportRange[0],
    priceExportMax: priceExportRange[1],
    priceImportMin: priceImportRange[0],
    priceImportMax: priceImportRange[1],
    quantityMin: quantityRange[0],
    quantityMax: quantityRange[1],
  };

  const fetchData = async (page, filters) => {
    try {
      const data = await fetchStock(page, 8, filters);
      setProducts(data?.metadata?.data || []);
      setCurrentData(data?.metadata?.data || []);
      setTotalPages(data?.metadata?.totalPage || 0);
      setTotalRecords(data?.metadata?.totalItem || 0);
      setCurrentPage(page);
    } catch (e) {
      toast.error('An error occurred while fetching the stock. Please try again or contact the administrator.');
    }
  };

  const fetchProductByName = async () => {
    try {
      const data = await fetchStock(1, 8, { product_name: productFilter });
      setProducts(data?.metadata?.data || []);
    } catch (e) {
      toast.error('An error occurred while fetching the stock. Please try again or contact the administrator.');
    }
  }

  const isFirstRun = useRef(true);


  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      fetchData(1, currentFilter);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText, manufacturerFilter, categoryFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProductByName();
    }, 300);
    return () => clearTimeout(timeout);
  }, [productFilter]);


  const applyFilters = () => {
    fetchData(1, currentFilter);
  };

  const resetFilters = () => {
    setSearchText('');
    setManufacturerFilter('');
    setCategoryFilter('');
    setPriceExportRange([0, 100000]);
    setProductFilter('');
    setPriceImportRange([0, 100000]);
    setQuantityRange([0, 1000]);
    fetchData(1, {
      product_name: '',
      manufacturer: '',
      category_name: '',
      priceExportMin: 0,
      priceExportMax: 100000,
      priceImportMin: 0,
      priceImportMax: 100000,
      quantityMin: 0,
      quantityMax: 1000,
    });
  };

  const getNextPage = (page) => {
    fetchData(page, currentFilter);
  };

  return {
    currentData,
    totalPages,
    totalRecords,
    currentPage,
    searchText,
    setSearchText,
    manufacturerFilter,
    setManufacturerFilter,
    categoryFilter,
    setCategoryFilter,
    priceExportRange,
    setPriceExportRange,
    priceImportRange,
    setPriceImportRange,
    quantityRange,
    setQuantityRange,
    applyFilters,
    resetFilters,
    getNextPage,
    productFilter,
    setProductFilter,
    products,
    setProducts
  };
}