import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { membersApi, VMember } from '../services/membersApi';
import { Modal } from '../components/Modal';
import { Edit, Archive, RotateCcw, Trash2, Plus, LogOut, Users, ArchiveX, Search } from 'lucide-react';
import { Button } from '../components/Button';

interface MembersDashboardProps {
  onNavigateToForm: (memberId?: string) => void;
  onNavigateToArchive: () => void;
}

export const MembersDashboard = ({ onNavigateToForm, onNavigateToArchive }: MembersDashboardProps) => {
  const { token, user, logout } = useAuth();
  const [members, setMembers] = useState<VMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<VMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalState, setModalState] = useState<{
    type: 'archive' | 'restore' | 'delete' | null;
    member: VMember | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    type: null,
    member: null,
    isOpen: false,
    isLoading: false,
  });

  const fetchMembers = async () => {
    if (!token) return;

    setIsLoading(true);
    setError('');

    try {
      const { members: data } = await membersApi.getMembers(token);
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((member) => {
        const search = searchTerm.toLowerCase();
        return (
          member.name.toLowerCase().includes(search) ||
          member.vm_id.toLowerCase().includes(search) ||
          member.service_no.toLowerCase().includes(search) ||
          member.mobile_no.includes(search) ||
          member.old_rin_no.toLowerCase().includes(search) ||
          member.rank?.name.toLowerCase().includes(search) ||
          member.status?.name.toLowerCase().includes(search) ||
          member.primary_address?.state?.name.toLowerCase().includes(search) ||
          member.primary_address?.district?.name.toLowerCase().includes(search)
        );
      });
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const openModal = (type: 'archive' | 'restore' | 'delete', member: VMember) => {
    setModalState({ type, member, isOpen: true, isLoading: false });
  };

  const closeModal = () => {
    setModalState({ type: null, member: null, isOpen: false, isLoading: false });
  };

  const handleConfirmAction = async () => {
    if (!modalState.member || !token || !user) return;

    setModalState(prev => ({ ...prev, isLoading: true }));

    try {
      switch (modalState.type) {
        case 'archive':
          await membersApi.archiveMember(token, modalState.member.vm_id, user.id);
          break;
        case 'restore':
          await membersApi.restoreMember(token, modalState.member.vm_id, user.id);
          break;
        case 'delete':
          await membersApi.deleteMember(token, modalState.member.vm_id, false);
          break;
      }

      closeModal();
      fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
      closeModal();
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">Active Members</h1>
                  <p className="text-sm text-gray-600">View and manage all active members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => onNavigateToForm()}>
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, service no, mobile, RIN, rank, status, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600 mb-6">{searchTerm ? 'No members match your search criteria' : 'Get started by adding your first member'}</p>
              <Button onClick={() => onNavigateToForm()}>
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Member Id</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">DOB</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">RIN</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ref No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.vm_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.vm_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.service_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {member.rank?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-xs">
                          {member.primary_address?.state?.name && member.primary_address?.district?.name
                            ? `${member.primary_address.district.name}, ${member.primary_address.state.name}`
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {member.mobile_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(member.date_of_birth)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {member.old_rin_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {member.new_rin_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.status?.name === 'Alive'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onNavigateToForm(member.vm_id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal('archive', member)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal('delete', member)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'archive' ? 'Archive Member' :
          modalState.type === 'restore' ? 'Restore Member' :
          'Delete Member'
        }
        onConfirm={handleConfirmAction}
        confirmText={
          modalState.type === 'archive' ? 'Archive' :
          modalState.type === 'restore' ? 'Restore' :
          'Delete'
        }
        isLoading={modalState.isLoading}
        isDanger={modalState.type === 'delete'}
      >
        <p className="text-gray-700">
          Are you sure you want to {modalState.type} <span className="font-semibold">{modalState.member?.name}</span>?
          {modalState.type === 'delete' && ' This action cannot be easily undone.'}
        </p>
      </Modal>
    </div>
  );
};
