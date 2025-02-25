import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
} from "lucide-react";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, pageSize, sortField, sortDirection, filterType, searchTerm]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions`,
        {
          params: {
            page: currentPage,
            limit: pageSize,
            sort: sortField,
            order: sortDirection,
            type: filterType,
            search: searchTerm,
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err.response?.data?.message ||
          "Kunne ikke hente transaksjoner. Prøv igjen senere."
      );
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("no-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, type) => {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="p-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">Alle transaksjoner</option>
            <option value="deposit">Innskudd</option>
            <option value="withdrawal">Uttak</option>
          </select>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Søk beskrivelse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md flex-grow focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <button
            type="submit"
            className="bg-red-600 text-white p-2 rounded-md flex items-center justify-center hover:bg-red-700"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader size={24} className="animate-spin text-red-600" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Ingen transaksjoner funnet</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("date")}
                  >
                    Dato{" "}
                    {sortField === "date" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("description")}
                  >
                    Beskrivelse{" "}
                    {sortField === "description" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("amount")}
                  >
                    Beløp{" "}
                    {sortField === "amount" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("balance")}
                  >
                    Saldo{" "}
                    {sortField === "balance" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {transaction.type === "deposit" ? (
                        <span className="flex items-center text-green-600">
                          <ArrowDownLeft size={16} className="mr-1" /> Innskudd
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <ArrowUpRight size={16} className="mr-1" /> Uttak
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-right ${
                        transaction.type === "deposit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "deposit" ? "+" : "-"}{" "}
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatAmount(transaction.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Viser {(currentPage - 1) * pageSize + 1}-
              {Math.min(
                currentPage * pageSize,
                transactions.length + (currentPage - 1) * pageSize
              )}{" "}
              av {totalPages * pageSize} transaksjoner
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-md p-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1 rounded-md ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
