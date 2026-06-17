import React, { useState, useEffect } from 'react';
import { Calendar, MessageSquare, Download, Trash, Check, LogOut } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'reviews'>('appointments');

  const checkAuth = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setIsAuthenticated(false);
      }
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchData = async () => {
    try {
      const appq = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const revq = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      
      const [appRes, revRes] = await Promise.all([getDocs(appq), getDocs(revq)]);
      
      setAppointments(appRes.docs.map(d => ({ id: d.id, ...d.data() })));
      setReviews(revRes.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Firebase Fetch failed, using local fallback', e);
      // Fallback for statically hosted or unconfigured firebase
      const storedAppts = JSON.parse(localStorage.getItem('luxm_appointments') || '[]');
      const storedRevs = JSON.parse(localStorage.getItem('luxm_reviews') || '[]');
      setAppointments(storedAppts);
      setReviews(storedRevs);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const adminEmail = 'admin@luxmsalon.in';
    try {
      await signInWithEmailAndPassword(auth, adminEmail, password);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential' || e.code === 'auth/invalid-login-credentials') {
        try {
           await createUserWithEmailAndPassword(auth, adminEmail, password);
        } catch (createErr: any) {
           setError('Failed to login or create admin user: ' + createErr.message);
        }
      } else if (e.code === 'auth/operation-not-allowed') {
        setError('Please enable Email/Password sign-in method in Firebase Auth console.');
      } else {
        setError('Login failed: ' + e.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Delete appointment?')) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments(prev => prev.filter(app => app.id !== id));
    } catch(e) {}
  };

  const exportAppointments = async () => {
    alert('Export is currently unavailable in this version.');
  };

  const approveReview = async (id: string) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { approved: true });
      fetchData();
    } catch(e) {}
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete review?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
      fetchData();
    } catch(e) {}
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-sm">
          <h1 className="text-2xl font-serif mb-6 text-center text-gray-900">Admin Login</h1>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full border-gray-300 border p-3 rounded"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-[#1C1917] text-white py-3 rounded hover:bg-[#C4A47C]">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white shadow-sm border rounded-lg overflow-hidden">
        
        <header className="bg-[#1C1917] text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Luxm Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-[#C4A47C]">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        <div className="p-6">
          <div className="flex gap-4 mb-8 border-b">
            <button 
              className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'appointments' ? 'border-b-2 border-[#C4A47C] text-[#C4A47C]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar className="w-4 h-4" /> Appointments
            </button>
            <button 
              className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'reviews' ? 'border-b-2 border-[#C4A47C] text-[#C4A47C]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare className="w-4 h-4" /> Reviews
            </button>
          </div>

          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Recent Appointments</h2>
                <button onClick={exportAppointments} className="flex items-center gap-2 bg-[#C4A47C] text-white px-4 py-2 rounded text-sm hover:bg-[#A68A66]">
                  <Download className="w-4 h-4" /> Export Excel
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Note: Appointments data older than 30 days is automatically deleted.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                      <th className="p-4 font-medium">Date/Time</th>
                      <th className="p-4 font-medium">Client</th>
                      <th className="p-4 font-medium">Service</th>
                      <th className="p-4 font-medium">Notes</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center text-gray-500">No appointments found.</td></tr>
                    ) : (
                      appointments.map(app => (
                        <tr key={app.id} className="border-b text-sm">
                          <td className="p-4">{app.date} <br/> <span className="text-gray-500">{app.time}</span></td>
                          <td className="p-4">{app.name} <br/> <span className="text-gray-500">{app.phone}</span></td>
                          <td className="p-4">{app.service}</td>
                          <td className="p-4 max-w-xs truncate" title={app.notes}>{app.notes || '-'}</td>
                          <td className="p-4">
                            <button onClick={() => deleteAppointment(app.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                              <Trash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-medium mb-6">Manage Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews found.</p>
                ) : (
                  reviews.map(rev => (
                    <div key={rev.id} className="border p-4 rounded bg-gray-50 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{rev.name} <span className="text-gray-400 text-sm font-normal">({rev.date})</span></h3>
                          <div className="text-[#C4A47C]">★ {rev.rating}/5</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">"{rev.text}"</p>
                      </div>
                      <div className="flex justify-between items-center border-t pt-4">
                        <span className={`text-xs px-2 py-1 rounded ${rev.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {rev.approved ? 'Approved' : 'Pending Approval'}
                        </span>
                        <div className="flex gap-2">
                          {!rev.approved && (
                            <button onClick={() => approveReview(rev.id)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => deleteReview(rev.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
