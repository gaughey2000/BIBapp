// client/src/pages/AdminDashboard-Simplified.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const treatmentTypes = [
    { value: 'BOTULINUM_TOXIN', label: 'Botulinum Toxin' },
    { value: 'DERMAL_FILLER', label: 'Dermal Filler' },
    { value: 'CHEMICAL_PEELS', label: 'Chemical Peels' },
    { value: 'SKIN_CARE', label: 'Skin Care' },
    { value: 'OTHER_SERVICES', label: 'Other Services' },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const data = await api.getAdminServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/admin/login');
    }
  }

  async function handleSaveService(serviceData) {
    try {
      if (editingService) {
        await api.updateService(editingService.service_id, serviceData);
      } else {
        await api.createService(serviceData);
      }
      await fetchServices();
      setEditingService(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to save service:', err);
      alert('Failed to save service');
    }
  }

  async function handleDeleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(serviceId);
      await fetchServices();
    } catch (err) {
      console.error('Failed to delete service:', err);
      alert('Failed to delete service');
    }
  }

  async function handleToggleActive(service) {
    try {
      await api.updateService(service.service_id, {
        is_active: !service.is_active,
      });
      await fetchServices();
    } catch (err) {
      console.error('Failed to toggle service:', err);
      alert('Failed to update service');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[color:var(--rose)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--cream)] py-8">
      <div className="container-narrow">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--ink)] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">Manage your treatments and services</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        {/* Add Service Button */}
        {!showAddForm && !editingService && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              + Add New Service
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingService) && (
          <ServiceForm
            service={editingService}
            treatmentTypes={treatmentTypes}
            onSave={handleSaveService}
            onCancel={() => {
              setEditingService(null);
              setShowAddForm(false);
            }}
          />
        )}

        {/* Services List */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-[color:var(--ink)] mb-4">
            All Services ({services.length})
          </h2>
          
          {services.length === 0 ? (
            <p className="text-slate-600 text-center py-8">
              No services yet. Add your first service above.
            </p>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.service_id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-[color:var(--rose)]/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-[color:var(--ink)]">
                          {service.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            service.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {treatmentTypes.find((t) => t.value === service.treatment_type)?.label || service.treatment_type}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-slate-600 text-sm mb-2">
                          {service.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span>£{(service.price_cents / 100).toFixed(2)}</span>
                        <span>•</span>
                        <span>{service.duration_min} min</span>
                        {service.buffer_min > 0 && (
                          <>
                            <span>•</span>
                            <span>{service.buffer_min} min buffer</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className="px-3 py-1 text-sm rounded border border-slate-300 hover:bg-slate-50 transition-colors"
                      >
                        {service.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setEditingService(service)}
                        className="px-3 py-1 text-sm rounded bg-[color:var(--rose)] text-white hover:bg-[color:var(--rose-dark)] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.service_id)}
                        className="px-3 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceForm({ service, treatmentTypes, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price_cents: service?.price_cents || 0,
    duration_min: service?.duration_min || 30,
    buffer_min: service?.buffer_min || 15,
    is_active: service?.is_active ?? true,
    treatment_type: service?.treatment_type || 'OTHER_SERVICES',
    more_info: service?.more_info || '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-xl font-semibold text-[color:var(--ink)] mb-4">
        {service ? 'Edit Service' : 'Add New Service'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[color:var(--rose)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Treatment Type *
            </label>
            <select
              required
              value={formData.treatment_type}
              onChange={(e) =>
                setFormData({ ...formData, treatment_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[color:var(--rose)] focus:border-transparent"
            >
              {treatmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[color:var(--rose)] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price (£) *
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={(formData.price_cents / 100).toFixed(2)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price_cents: Math.round(parseFloat(e.target.value) * 100),
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[color:var(--rose)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duration (min) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration_min}
              onChange={(e) =>
                setFormData({ ...formData, duration_min: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[color:var(--rose)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Buffer (min)
            </label>
            <input
              type="number"
              min="0"
              value={formData.buffer_min}
              onChange={(e) =>
                setFormData({ ...formData, buffer_min: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[color:var(--rose)] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Additional Information
          </label>
          <textarea
            value={formData.more_info}
            onChange={(e) =>
              setFormData({ ...formData, more_info: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[color:var(--rose)] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="w-4 h-4 text-[color:var(--rose)] border-slate-300 rounded focus:ring-[color:var(--rose)]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
            Active (visible to customers)
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary">
            {service ? 'Update Service' : 'Add Service'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
