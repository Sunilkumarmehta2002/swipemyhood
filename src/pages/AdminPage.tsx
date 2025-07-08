import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Users, MessageSquare, BarChart3, Key, Edit, Trash2, Reply,
  UserPlus, Download, Search, Activity, Shield
} from 'lucide-react';
import { 
  collection, getDocs, query, orderBy,
  doc, updateDoc, deleteDoc, addDoc, where,
  Timestamp, setDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalSwipes: number;
  totalMatches: number;
  totalMessages: number;
  newMessages: number;
  activeUsers: number;
}

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Timestamp;
  isAdmin: boolean;
  lastActive?: Timestamp;
  superAdmin?: boolean;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Timestamp;
  status: 'new' | 'replied' | 'resolved';
  adminReply?: string;
  repliedAt?: Timestamp;
}

export function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSwipes: 0,
    totalMatches: 0,
    totalMessages: 0,
    newMessages: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiConfig, setApiConfig] = useState<any>({});
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiLoading, setApiLoading] = useState(false);

  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [neighName, setNeighName] = useState('');
  const [neighCity, setNeighCity] = useState('');
  const [neighLoading, setNeighLoading] = useState(false);

  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [algorithmSettings, setAlgorithmSettings] = useState<any>({});
  const [algoLoading, setAlgoLoading] = useState(false);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  
  const { logout, currentUser, userData } = useAuth();
  const navigate = useNavigate();

  // Add state for edit modal
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<'admin' | 'user'>('user');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const [usersSnapshot, swipesSnapshot, matchesSnapshot, messagesSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'swipes')),
        getDocs(collection(db, 'matches')),
        getDocs(collection(db, 'contact-messages'))
      ]);

      const totalUsers = usersSnapshot.size;
      const totalSwipes = swipesSnapshot.size;
      const totalMatches = matchesSnapshot.size;
      const totalMessages = messagesSnapshot.size;
      const newMessages = messagesSnapshot.docs.filter(doc => doc.data().status === 'new').length;
      const activeUsers = usersSnapshot.docs.filter(doc => {
        const lastActive = doc.data().lastActive;
        if (!lastActive) return false;
        const daysSinceActive = (Date.now() - lastActive.toDate().getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive <= 7;
      }).length;

      setStats({
        totalUsers,
        totalSwipes,
        totalMatches,
        totalMessages,
        newMessages,
        activeUsers
      });

      // Load users
      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          name: data.name || '',
          createdAt: data.createdAt || Timestamp.now(),
          isAdmin: typeof data.isAdmin === 'boolean' ? data.isAdmin : false,
          lastActive: data.lastActive || null,
          superAdmin: typeof data.superAdmin === 'boolean' ? data.superAdmin : false,
        } as User;
      });
      setUsers(usersData);

      // Load messages
      const messagesData = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
      setMessages(messagesData);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const messageRef = doc(db, 'contact-messages', selectedMessage.id);
      await updateDoc(messageRef, {
        status: 'replied',
        adminReply: replyText,
        repliedAt: Timestamp.now()
      });

      // Add to admin-replies collection for tracking
      await addDoc(collection(db, 'admin-replies'), {
        messageId: selectedMessage.id,
        userEmail: selectedMessage.email,
        reply: replyText,
        timestamp: Timestamp.now()
      });

      toast.success('Reply sent successfully');
      setSelectedMessage(null);
      setReplyText('');
      loadAdminData(); // Refresh data
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteDoc(doc(db, 'contact-messages', messageId));
      toast.success('Message deleted successfully');
      loadAdminData();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete user ${user.email} and all their activities?`)) return;
    setLoading(true);
    try {
      // Delete user document
      await deleteDoc(doc(db, 'users', user.id));
      // Delete user swipes
      const swipesSnap = await getDocs(query(collection(db, 'swipes'), where('userId', '==', user.id)));
      await Promise.all(swipesSnap.docs.map(docu => deleteDoc(doc(db, 'swipes', docu.id))));
      // Delete user matches
      const matchesSnap = await getDocs(query(collection(db, 'matches'), where('userId', '==', user.id)));
      await Promise.all(matchesSnap.docs.map(docu => deleteDoc(doc(db, 'matches', docu.id))));
      // Delete user contact messages
      const messagesSnap = await getDocs(query(collection(db, 'contact-messages'), where('email', '==', user.email)));
      await Promise.all(messagesSnap.docs.map(docu => deleteDoc(doc(db, 'contact-messages', docu.id))));
      // Delete admin-user-messages
      const chatSnap = await getDocs(query(collection(db, 'admin-user-messages'), where('userId', '==', user.id)));
      await Promise.all(chatSnap.docs.map(docu => deleteDoc(doc(db, 'admin-user-messages', docu.id))));
      toast.success('User and all activities deleted');
      loadAdminData();
    } catch (err) {
      toast.error('Failed to delete user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openChatWithUser = async (user: User) => {
    setChatUser(user);
    setChatLoading(true);
    try {
      const msgsSnap = await getDocs(query(
        collection(db, 'admin-user-messages'),
        where('userId', '==', user.id),
        orderBy('timestamp', 'asc')
      ));
      setChatMessages(msgsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setChatLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatUser || !chatInput.trim()) return;
    setChatLoading(true);
    try {
      await addDoc(collection(db, 'admin-user-messages'), {
        userId: chatUser.id,
        sender: 'admin',
        message: chatInput,
        timestamp: Timestamp.now(),
      });
      setChatInput('');
      openChatWithUser(chatUser); // reload messages
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setChatLoading(false);
    }
  };

  // API CONFIGURATION LOGIC
  const loadApiConfig = async () => {
    setApiLoading(true);
    try {
      const docSnap = await getDocs(collection(db, 'platform-config'));
      let config: any = {};
      docSnap.forEach(docu => {
        config[docu.id] = docu.data().value;
      });
      setApiConfig(config);
    } catch (err) {
      toast.error('Failed to load API config');
    } finally {
      setApiLoading(false);
    }
  };
  const saveApiKey = async () => {
    if (!apiKeyName || !apiKeyValue) return;
    setApiLoading(true);
    try {
      await setDoc(doc(db, 'platform-config', apiKeyName), { value: apiKeyValue });
      setApiKeyName(''); setApiKeyValue('');
      loadApiConfig();
      toast.success('API key saved');
    } catch (err) {
      toast.error('Failed to save API key');
    } finally {
      setApiLoading(false);
    }
  };
  const deleteApiKey = async (key: string) => {
    setApiLoading(true);
    try {
      await deleteDoc(doc(db, 'platform-config', key));
      loadApiConfig();
      toast.success('API key deleted');
    } catch (err) {
      toast.error('Failed to delete API key');
    } finally {
      setApiLoading(false);
    }
  };

  // NEIGHBORHOOD LOGIC
  const loadNeighborhoods = async () => {
    setNeighLoading(true);
    try {
      const snap = await getDocs(collection(db, 'neighborhoods'));
      setNeighborhoods(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast.error('Failed to load neighborhoods');
    } finally {
      setNeighLoading(false);
    }
  };
  const addNeighborhood = async () => {
    if (!neighName || !neighCity) return;
    setNeighLoading(true);
    try {
      await addDoc(collection(db, 'neighborhoods'), { name: neighName, city: neighCity });
      setNeighName(''); setNeighCity('');
      loadNeighborhoods();
      toast.success('Neighborhood added');
    } catch (err) {
      toast.error('Failed to add neighborhood');
    } finally {
      setNeighLoading(false);
    }
  };
  const deleteNeighborhood = async (id: string) => {
    setNeighLoading(true);
    try {
      await deleteDoc(doc(db, 'neighborhoods', id));
      loadNeighborhoods();
      toast.success('Neighborhood deleted');
    } catch (err) {
      toast.error('Failed to delete neighborhood');
    } finally {
      setNeighLoading(false);
    }
  };

  // ALGORITHM SETTINGS LOGIC
  const loadAlgorithmSettings = async () => {
    setAlgoLoading(true);
    try {
      const snap = await getDocs(collection(db, 'algorithm-settings'));
      let settings: any = {};
      snap.forEach(docu => { settings[docu.id] = docu.data().value; });
      setAlgorithmSettings(settings);
    } catch (err) {
      toast.error('Failed to load algorithm settings');
    } finally {
      setAlgoLoading(false);
    }
  };
  const saveAlgorithmSetting = async (key: string, value: any) => {
    setAlgoLoading(true);
    try {
      await setDoc(doc(db, 'algorithm-settings', key), { value });
      loadAlgorithmSettings();
      toast.success('Algorithm setting saved');
    } catch (err) {
      toast.error('Failed to save algorithm setting');
    } finally {
      setAlgoLoading(false);
    }
  };

  // ADMIN MANAGEMENT LOGIC
  const loadAdminUsers = async () => {
    setAdminLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'users'), where('isAdmin', '==', true)));
      setAdminUsers(
        snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || '',
            name: data.name || '',
            createdAt: data.createdAt || Timestamp.now(),
            isAdmin: typeof data.isAdmin === 'boolean' ? data.isAdmin : false,
            lastActive: data.lastActive || null,
            superAdmin: typeof data.superAdmin === 'boolean' ? data.superAdmin : false,
          } as User;
        })
      );
    } catch (err) {
      toast.error('Failed to load admin users');
    } finally {
      setAdminLoading(false);
    }
  };
  const promoteToAdmin = async (user: User) => {
    setAdminLoading(true);
    try {
      await setDoc(doc(db, 'users', user.id), { ...user, isAdmin: true }, { merge: true });
      loadAdminUsers();
      toast.success('User promoted to admin');
    } catch (err) {
      toast.error('Failed to promote user');
    } finally {
      setAdminLoading(false);
    }
  };
  const demoteAdmin = async (user: User) => {
    setAdminLoading(true);
    try {
      await setDoc(doc(db, 'users', user.id), { ...user, isAdmin: false }, { merge: true });
      loadAdminUsers();
      toast.success('Admin demoted');
    } catch (err) {
      toast.error('Failed to demote admin');
    } finally {
      setAdminLoading(false);
    }
  };

  const promoteToSuperAdmin = async (user: User) => {
    if (!userData?.superAdmin) return;
    setAdminLoading(true);
    try {
      await setDoc(doc(db, 'users', user.id), { ...user, isAdmin: true, superAdmin: true }, { merge: true });
      loadAdminUsers();
      toast.success('User promoted to super admin');
    } catch (err) {
      toast.error('Failed to promote to super admin');
    } finally {
      setAdminLoading(false);
    }
  };
  const demoteSuperAdmin = async (user: User) => {
    if (!userData?.superAdmin) return;
    // Prevent demoting last super admin
    if (adminUsers.filter(a => a.superAdmin).length <= 1) {
      toast.error('Cannot demote the last super admin');
      return;
    }
    setAdminLoading(true);
    try {
      await setDoc(doc(db, 'users', user.id), { ...user, superAdmin: false }, { merge: true });
      loadAdminUsers();
      toast.success('Super admin demoted');
    } catch (err) {
      toast.error('Failed to demote super admin');
    } finally {
      setAdminLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = usersSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || '',
            name: data.name || '',
            createdAt: data.createdAt || Timestamp.now(),
            isAdmin: typeof data.isAdmin === 'boolean' ? data.isAdmin : false,
            lastActive: data.lastActive || null,
            superAdmin: typeof data.superAdmin === 'boolean' ? data.superAdmin : false,
          } as User;
        });
      setUsers(usersData);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  // Edit user handler
  const openEditUser = (user: User) => {
    setEditUser(user);
    setEditName(user.name || '');
    setEditEmail(user.email);
    setEditStatus(user.isAdmin ? 'admin' : 'user');
  };
  const saveEditUser = async () => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      await setDoc(doc(db, 'users', editUser.id), {
        ...editUser,
        name: editName,
        email: editEmail,
        isAdmin: editStatus === 'admin',
      }, { merge: true });
      toast.success('User updated');
      setEditUser(null);
      loadAllUsers();
      loadAdminData();
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">SwipeMyHood Platform Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-green-600 text-xs">+{stats.activeUsers} active</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSwipes}</p>
                  <p className="text-gray-600 text-sm">Total Swipes</p>
                  <p className="text-blue-600 text-xs">+{Math.round(stats.totalSwipes / stats.totalUsers)} avg/user</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-red-600 text-white p-3 rounded-lg">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
                  <p className="text-gray-600 text-sm">Total Matches</p>
                  <p className="text-purple-600 text-xs">{stats.totalSwipes > 0 ? Math.round((stats.totalMatches / stats.totalSwipes) * 100) : 0}% rate</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white p-3 rounded-lg">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                  <p className="text-gray-600 text-sm">Contact Messages</p>
                  <p className="text-red-600 text-xs">{stats.newMessages} new</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'messages', label: 'Messages', icon: MessageSquare },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Platform Overview</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-4">User Engagement</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Users (7 days)</span>
                          <span className="font-semibold">{stats.activeUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Swipes per User</span>
                          <span className="font-semibold">{stats.totalUsers > 0 ? Math.round(stats.totalSwipes / stats.totalUsers) : 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Match Rate</span>
                          <span className="font-semibold">{stats.totalSwipes > 0 ? Math.round((stats.totalMatches / stats.totalSwipes) * 100) : 0}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-4">Support & Messages</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">New Messages</span>
                          <span className="font-semibold text-red-600">{stats.newMessages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Messages</span>
                          <span className="font-semibold">{stats.totalMessages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Rate</span>
                          <span className="font-semibold">{stats.totalMessages > 0 ? Math.round(((stats.totalMessages - stats.newMessages) / stats.totalMessages) * 100) : 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <UserPlus size={16} className="inline mr-2" />
                      Add User
                    </button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name || 'No name'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.createdAt.toDate().toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.isAdmin 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {user.isAdmin ? 'Admin' : 'User'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => openChatWithUser(user)}>
                                  <MessageSquare size={16} />
                                </button>
                                <button className="text-green-600 hover:text-green-900 mr-3" onClick={() => openEditUser(user)}>
                                  <Edit size={16} />
                                </button>
                                <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(user)}>
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Contact Messages</h3>
                    <div className="flex space-x-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <Download size={16} className="inline mr-2" />
                        Export
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search messages..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {filteredMessages.map((message) => (
                      <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                            <p className="text-sm text-gray-600">From: {message.name} ({message.email})</p>
                            <p className="text-xs text-gray-500">
                              {message.timestamp.toDate().toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              message.status === 'new' ? 'bg-red-100 text-red-800' :
                              message.status === 'replied' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                            <button
                              onClick={() => setSelectedMessage(message)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Reply size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{message.message}</p>
                        {message.adminReply && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                            <h5 className="font-semibold text-blue-900 mb-2">Admin Reply:</h5>
                            <p className="text-blue-800">{message.adminReply}</p>
                            <p className="text-xs text-blue-600 mt-2">
                              Replied on: {message.repliedAt?.toDate().toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Platform Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Key size={20} className="text-yellow-600" />
                        <h4 className="font-semibold text-yellow-800">API Configuration</h4>
                      </div>
                      <p className="text-yellow-700 text-sm mb-4">
                        Configure API keys for external services (Google Maps, WalkScore, etc.)
                      </p>
                      <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors" onClick={() => { setShowApiModal(true); loadApiConfig(); }}>
                        Manage API Keys
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-800 mb-4">Neighborhood Data</h4>
                      <p className="text-blue-700 text-sm mb-4">
                        Update neighborhood information and add new locations
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors" onClick={() => { setShowNeighborhoodModal(true); loadNeighborhoods(); }}>
                        Manage Neighborhoods
                      </button>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-800 mb-4">Algorithm Settings</h4>
                      <p className="text-purple-700 text-sm mb-4">
                        Adjust matching algorithm parameters and weights
                      </p>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" onClick={() => { setShowAlgorithmModal(true); loadAlgorithmSettings(); }}>
                        Configure Algorithm
                      </button>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-800 mb-4">Admin Management</h4>
                      <p className="text-green-700 text-sm mb-4">
                        Manage admin users and permissions
                      </p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors" onClick={() => { setShowAdminModal(true); loadAdminUsers(); loadAllUsers(); }}>
                        Manage Admins
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Reply to {selectedMessage.name}</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Original Message:</p>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm">{selectedMessage.message}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your reply here..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setReplyText('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {chatUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Chat with {chatUser.name || chatUser.email}</h3>
            <div className="h-64 overflow-y-auto border rounded p-3 mb-4 bg-gray-50">
              {chatLoading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : chatMessages.length === 0 ? (
                <div className="text-center text-gray-400">No messages yet.</div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`mb-2 flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}> 
                    <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      <span className="block text-sm">{msg.message}</span>
                      <span className="block text-xs mt-1 text-gray-300">{msg.timestamp && msg.timestamp.toDate().toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Type a message..."
                onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(); }}
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
              <button
                onClick={() => setChatUser(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">API Keys</h3>
              <button onClick={() => setShowApiModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            {apiLoading ? <div className="text-center py-8">Loading...</div> : (
              <>
                <table className="min-w-full mb-4">
                  <thead>
                    <tr className="text-left text-gray-600 text-sm border-b">
                      <th className="py-2">Key Name</th>
                      <th className="py-2">Value</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(apiConfig).length === 0 && (
                      <tr><td colSpan={3} className="text-gray-400 py-4 text-center">No API keys set.</td></tr>
                    )}
                    {Object.entries(apiConfig).map(([key, value]) => (
                      <tr key={key} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-mono text-xs">{key}</td>
                        <td className="py-2 font-mono text-xs max-w-xs truncate">
                          <span title={value as string}>{value as string}</span>
                          <button onClick={() => navigator.clipboard.writeText(value as string)} className="ml-2 text-blue-500 hover:underline text-xs">Copy</button>
                        </td>
                        <td className="py-2">
                          <button onClick={() => deleteApiKey(key)} className="text-red-600 hover:underline text-xs">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={apiKeyName} onChange={e => setApiKeyName(e.target.value)} placeholder="Key name" className="border px-3 py-2 rounded flex-1" />
                  <input type="text" value={apiKeyValue} onChange={e => setApiKeyValue(e.target.value)} placeholder="API key value" className="border px-3 py-2 rounded flex-2" />
                  <button onClick={saveApiKey} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Add</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Neighborhoods Modal */}
      {showNeighborhoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Neighborhoods</h3>
              <button onClick={() => setShowNeighborhoodModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            {neighLoading ? <div className="text-center py-8">Loading...</div> : (
              <>
                <table className="min-w-full mb-4">
                  <thead>
                    <tr className="text-left text-gray-600 text-sm border-b">
                      <th className="py-2">Name</th>
                      <th className="py-2">City</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neighborhoods.length === 0 && (
                      <tr><td colSpan={3} className="text-gray-400 py-4 text-center">No neighborhoods found.</td></tr>
                    )}
                    {neighborhoods.map(n => (
                      <tr key={n.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{n.name}</td>
                        <td className="py-2">{n.city}</td>
                        <td className="py-2">
                          <button onClick={() => deleteNeighborhood(n.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={neighName} onChange={e => setNeighName(e.target.value)} placeholder="Neighborhood name" className="border px-3 py-2 rounded flex-1" />
                  <input type="text" value={neighCity} onChange={e => setNeighCity(e.target.value)} placeholder="City" className="border px-3 py-2 rounded flex-1" />
                  <button onClick={addNeighborhood} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Algorithm Settings Modal */}
      {showAlgorithmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Algorithm Settings</h3>
              <button onClick={() => setShowAlgorithmModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            {algoLoading ? <div className="text-center py-8">Loading...</div> : (
              <>
                <table className="min-w-full mb-4">
                  <thead>
                    <tr className="text-left text-gray-600 text-sm border-b">
                      <th className="py-2">Parameter</th>
                      <th className="py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(algorithmSettings).length === 0 && (
                      <tr><td colSpan={2} className="text-gray-400 py-4 text-center">No settings found.</td></tr>
                    )}
                    {Object.entries(algorithmSettings).map(([key, value]) => (
                      <tr key={key} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-mono text-xs">{key}</td>
                        <td className="py-2">
                          <input type="text" value={value as string} onChange={e => saveAlgorithmSetting(key, e.target.value)} className="border px-3 py-2 rounded w-full" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="New parameter" className="border px-3 py-2 rounded flex-1" onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value) saveAlgorithmSetting(e.currentTarget.value, '');
                  }} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Admin Management Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Admin Users</h3>
              <button onClick={() => setShowAdminModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            {adminLoading ? <div className="text-center py-8">Loading...</div> : (
              <>
                <table className="min-w-full mb-4">
                  <thead>
                    <tr className="text-left text-gray-600 text-sm border-b">
                      <th className="py-2">Email</th>
                      <th className="py-2">Name</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.length === 0 && (
                      <tr><td colSpan={4} className="text-gray-400 py-4 text-center">No admin users found.</td></tr>
                    )}
                    {adminUsers.map(u => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{u.email}</td>
                        <td className="py-2">{u.name}</td>
                        <td className="py-2">
                          {u.superAdmin ? (
                            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-bold mr-2">Super Admin</span>
                          ) : u.isAdmin ? (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold mr-2">Admin</span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs mr-2">User</span>
                          )}
                        </td>
                        <td className="py-2">
                          <button onClick={() => demoteAdmin(u)} className="text-red-600 hover:underline text-xs">Demote</button>
                          {userData?.superAdmin && (
                            <button onClick={() => promoteToSuperAdmin(u)} className="text-yellow-700 hover:underline text-xs ml-2">Promote to Super Admin</button>
                          )}
                          {userData?.superAdmin && u.superAdmin && adminUsers.filter(a => a.superAdmin).length > 1 && (
                            <button onClick={() => demoteSuperAdmin(u)} className="text-yellow-700 hover:underline text-xs ml-2">Demote Super Admin</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mb-4">
                  <span className="font-semibold">Promote user to admin:</span>
                  <select className="border ml-2 px-2 py-2 rounded w-64" onChange={e => {
                    const user = users.find(u => u.id === e.target.value);
                    if (user) promoteToAdmin(user);
                  }}>
                    <option value="">Select user</option>
                    {users.filter(u => !u.isAdmin).map(u => (
                      <option key={u.id} value={u.id}>{u.email} {u.name && `(${u.name})`}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="border px-3 py-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="border px-3 py-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value as 'admin' | 'user')} className="border px-3 py-2 rounded w-full">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditUser(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={saveEditUser} disabled={editLoading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
