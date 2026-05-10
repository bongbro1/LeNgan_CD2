import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

import CustomerStats from '../../components/customers/CustomerStats';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerProfile from '../../components/customers/CustomerProfile';
import CustomerModal from '../../components/customers/CustomerModal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ platform: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async (page = 1) => {
    try {
      setLoading(page === 1);
      const query = `page=${page}&limit=10&search=${searchTerm}&socialPlatform=${filters.platform}`;
      const response = await axiosClient.get(`/customers?${query}`);
      const customerList = response.customers || [];
      setCustomers(customerList);
      setPagination(response.pagination || { totalPages: 1, total: 0 });

      if (customerList.length > 0 && page === 1 && !selectedCustomer) {
        handleSelectCustomer(customerList[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = async (customer) => {
    setIsDetailLoading(true);
    try {
      const detail = await axiosClient.get(`/customers/${customer.id}`);
      setSelectedCustomer(detail);
    } catch (err) {
      console.error('Error fetching customer detail:', err);
      setSelectedCustomer(customer);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingCustomer) {
        await axiosClient.put(`/customers/${editingCustomer.id}`, formData);
      } else {
        await axiosClient.post('/customers', formData);
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      fetchData(currentPage);
    } catch (err) {
      console.error('Error saving customer:', err);
      alert(err.response?.data?.message || 'Lỗi khi lưu khách hàng');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await axiosClient.delete(`/customers/${id}`);
        if (selectedCustomer?.id === id) {
          setSelectedCustomer(null);
        }
        fetchData(currentPage);
      } catch (err) {
        console.error('Error deleting customer:', err);
        alert(err.response?.data?.message || 'Lỗi khi xóa khách hàng');
      }
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, searchTerm, filters]);

  // Chỉ hiện loading spinner khi tải lần đầu và chưa có dữ liệu
  if (loading && customers.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-lg animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
        {/* Top Stats Section */}
        <CustomerStats
          total={pagination.total}
          returnRate={42.5}
          topChannel="Facebook"
        />

        <div className="flex flex-col lg:flex-row gap-lg h-[calc(100vh-260px)] items-stretch overflow-hidden">
          {/* Left Side: List */}
          <div className="lg:w-3/5 h-full flex flex-col">
            <CustomerTable
              customers={customers}
              selectedId={selectedCustomer?.id}
              onSelect={handleSelectCustomer}
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onSearch={setSearchTerm}
              searchTerm={searchTerm}
              filters={filters}
              onFilterChange={(platform) => setFilters({ ...filters, platform })}
              onAdd={() => { setEditingCustomer(null); setIsModalOpen(true); }}
              onEdit={(customer) => { setEditingCustomer(customer); setIsModalOpen(true); }}
              onDelete={handleDelete}
            />
          </div>

          {/* Right Side: Profile Detail */}
          <div className="lg:w-2/5 h-full flex flex-col">
            <CustomerProfile
              customer={selectedCustomer}
              loading={isDetailLoading}
              onEdit={(customer) => { setEditingCustomer(customer); setIsModalOpen(true); }}
              onDelete={() => handleDelete(selectedCustomer?.id)}
              onRefresh={() => handleSelectCustomer(selectedCustomer)}
            />
          </div>
        </div>
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCustomer(null); }}
        onSave={handleSave}
        initialData={editingCustomer}
        isLoading={isSaving}
      />
    </>
  );
};

export default Customers;
