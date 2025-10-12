import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { membersApi, VMember, VMemberCreate, VMemberUpdate } from '../services/membersApi';
import { lookupsApi, Service, Rank, Status, State, District } from '../services/lookupsApi';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface MemberFormProps {
  memberId?: string;
  onNavigateBack: () => void;
}

export const MemberForm = ({ memberId, onNavigateBack }: MemberFormProps) => {
  const { token, user } = useAuth();
  const isEditMode = !!memberId;

  const [formData, setFormData] = useState({
    service_no: '',
    service_id: 1,
    rank_id: 1,
    name: '',
    mobile_no: '',
    date_of_birth: '',
    date_of_marriage: '',
    old_rin_no: '',
    member_status: 1,
    description: '',
    address: '',
    city: '',
    district_id: 1,
    state_id: 1,
    postal_zip_code: '',
  });

  const [services, setServices] = useState<Service[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetchLookupData();
      if (isEditMode) {
        fetchMember();
      }
    }
  }, [memberId, token]);

  useEffect(() => {
    if (token && formData.service_id) {
      fetchRanks(formData.service_id);
    }
  }, [formData.service_id, token]);

  useEffect(() => {
    if (token && formData.state_id) {
      fetchDistricts(formData.state_id);
    }
  }, [formData.state_id, token]);

  const fetchLookupData = async () => {
    if (!token) return;

    try {
      const [servicesData, statusesData, statesData] = await Promise.all([
        lookupsApi.getServices(token),
        lookupsApi.getStatuses(token),
        lookupsApi.getStates(token),
      ]);

      setServices(servicesData);
      setStatuses(statusesData);
      setStates(statesData);

      if (servicesData.length > 0) {
        setFormData(prev => ({ ...prev, service_id: servicesData[0].id }));
      }
      if (statusesData.length > 0) {
        setFormData(prev => ({ ...prev, member_status: statusesData[0].id }));
      }
      if (statesData.length > 0) {
        setFormData(prev => ({ ...prev, state_id: statesData[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch lookup data:', err);
    }
  };

  const fetchRanks = async (serviceId: number) => {
    if (!token) return;

    try {
      const ranksData = await lookupsApi.getRanks(token, serviceId);
      setRanks(ranksData);
      if (ranksData.length > 0 && !isEditMode) {
        setFormData(prev => ({ ...prev, rank_id: ranksData[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch ranks:', err);
    }
  };

  const fetchDistricts = async (stateId: number) => {
    if (!token) return;

    try {
      const districtsData = await lookupsApi.getDistricts(token, stateId);
      setDistricts(districtsData);
      if (districtsData.length > 0 && !isEditMode) {
        setFormData(prev => ({ ...prev, district_id: districtsData[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch districts:', err);
    }
  };

  const fetchMember = async () => {
    if (!token || !memberId) return;

    setIsFetching(true);
    try {
      const member = await membersApi.getMemberById(token, memberId);
      setFormData({
        service_no: member.service_no,
        service_id: member.service_id,
        rank_id: member.rank_id,
        name: member.name,
        mobile_no: member.mobile_no,
        date_of_birth: member.date_of_birth,
        date_of_marriage: member.date_of_marriage || '',
        old_rin_no: member.old_rin_no,
        member_status: member.member_status,
        description: member.description || '',
        address: member.primary_address?.address || '',
        city: member.primary_address?.city || '',
        district_id: member.primary_address?.district_id || 1,
        state_id: member.primary_address?.state_id || 1,
        postal_zip_code: member.primary_address?.postal_zip_code || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load member');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      if (isEditMode && memberId) {
        const updateData: VMemberUpdate = {
          service_no: formData.service_no,
          service_id: formData.service_id,
          rank_id: formData.rank_id,
          name: formData.name,
          mobile_no: formData.mobile_no,
          date_of_birth: formData.date_of_birth,
          date_of_marriage: formData.date_of_marriage || undefined,
          old_rin_no: formData.old_rin_no,
          member_status: formData.member_status,
          description: formData.description || undefined,
          address_details: {
            address: formData.address,
            city: formData.city,
            district_id: formData.district_id,
            state_id: formData.state_id,
            postal_zip_code: formData.postal_zip_code,
          },
          modified_by: user.id,
        };
        await membersApi.updateMember(token, memberId, updateData);
      } else {
        const createData: VMemberCreate = {
          service_no: formData.service_no,
          service_id: formData.service_id,
          rank_id: formData.rank_id,
          name: formData.name,
          mobile_no: formData.mobile_no,
          date_of_birth: formData.date_of_birth,
          date_of_marriage: formData.date_of_marriage || undefined,
          old_rin_no: formData.old_rin_no,
          member_status: formData.member_status,
          description: formData.description || undefined,
          address_details: {
            address: formData.address,
            city: formData.city,
            district_id: formData.district_id,
            state_id: formData.state_id,
            postal_zip_code: formData.postal_zip_code,
          },
          created_by: user.id,
        };
        await membersApi.createMember(token, createData);
      }

      setSuccess(true);
      setTimeout(() => {
        onNavigateBack();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save member');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Member' : 'Add New Member'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isEditMode ? 'Update member information' : 'Fill in the details to add a new member'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Member {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Service Number"
                  type="text"
                  value={formData.service_no}
                  onChange={(e) => setFormData({ ...formData, service_no: e.target.value })}
                  required
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Service
                  </label>
                  <select
                    value={formData.service_id}
                    onChange={(e) => setFormData({ ...formData, service_id: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    required
                  >
                    <option value={-1} disabled>Select from Dropdown</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Rank
                  </label>
                  <select
                    value={formData.rank_id}
                    onChange={(e) => setFormData({ ...formData, rank_id: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    required
                  >
                    {ranks.map(rank => (
                      <option key={rank.id} value={rank.id}>{rank.name}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  label="Mobile Number"
                  type="text"
                  value={formData.mobile_no}
                  onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                  required
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  required
                />

                <Input
                  label="Date of Marriage"
                  type="date"
                  value={formData.date_of_marriage}
                  onChange={(e) => setFormData({ ...formData, date_of_marriage: e.target.value })}
                />

                <Input
                  label="Old RIN Number"
                  type="text"
                  value={formData.old_rin_no}
                  onChange={(e) => setFormData({ ...formData, old_rin_no: e.target.value })}
                  required
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Member Status
                  </label>
                  <select
                    value={formData.member_status}
                    onChange={(e) => setFormData({ ...formData, member_status: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    required
                  >
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="City"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      State
                    </label>
                    <select
                      value={formData.state_id}
                      onChange={(e) => setFormData({ ...formData, state_id: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      required
                    >
                      {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      District
                    </label>
                    <select
                      value={formData.district_id}
                      onChange={(e) => setFormData({ ...formData, district_id: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      required
                    >
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Postal/Zip Code"
                    type="text"
                    value={formData.postal_zip_code}
                    onChange={(e) => setFormData({ ...formData, postal_zip_code: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  placeholder="Additional notes or description..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <Button onClick={onNavigateBack} variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  <Save className="w-4 h-4" />
                  {isEditMode ? 'Update Member' : 'Create Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
