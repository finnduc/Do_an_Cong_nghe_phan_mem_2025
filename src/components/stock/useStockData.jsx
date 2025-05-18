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
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [quantityRange, setQuantityRange] = useState([0, 100000]);
  const [priceTypeFilter, setPriceTypeFilter] = useState('import');

  const currentFilter = {
    product_name: searchText,
    manufacturer: manufacturerFilter,
    category_name: categoryFilter,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    quantityMin: quantityRange[0],
    quantityMax: quantityRange[1],
    action: priceTypeFilter,
  };

  const fetchData = async (page, filters) => {
    try {
      const data = await fetchStock(page, 8, filters);
      setCurrentData(data?.metadata?.data || []);
      setTotalPages(data?.metadata?.totalPage || 0);
      setTotalRecords(data?.metadata?.totalItem || 0);
      setCurrentPage(page);
    } catch (e) {
      toast.error('An error occurred while fetching the stock. Please try again or contact the administrator.');
    }
  };

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


  const applyFilters = () => {
    fetchData(1, currentFilter);
  };

  const resetFilters = () => {
    setSearchText('');
    setManufacturerFilter('');
    setCategoryFilter('');
    setPriceRange([0, 100000]);
    setQuantityRange([0, 100000]);
    setPriceTypeFilter('import');
    fetchData(1, {
      product_name: '',
      manufacturer: '',
      category_name: '',
      priceMin: 0,
      priceMax: 100000,
      quantityMin: 0,
      quantityMax: 100000,
      action: 'import',
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
    priceRange,
    setPriceRange,
    quantityRange,
    setQuantityRange,
    priceTypeFilter,
    setPriceTypeFilter,
    applyFilters,
    resetFilters,
    getNextPage,
  };
}