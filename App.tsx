
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SEEDED_EVENTS, SEEDED_BOOKINGS, TRIP_START_DATE, TRIP_END_DATE, DEFAULT_MEMBERS, ANIMAL_AVATARS } from './constants';
import { EventType, TravelEvent, Booking, Expense, JournalEntry, PlanningItem, Member } from './types';

// --- SVGs for Icons ---
const Icons = {
  Schedule: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Bookings: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  Expense: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Journal: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Planning: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  Plane: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>,
  Location: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  Camera: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
};

const EXCHANGE_RATE = 32.5;

// --- Helpers ---
const getInitialDate = () => {
  const today = new Date().toISOString().split('T')[0];
  if (today >= TRIP_START_DATE && today <= TRIP_END_DATE) {
    return today;
  }
  return TRIP_START_DATE;
};

// --- Shared State Context ---
const MemberAvatar: React.FC<{ avatar: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ avatar, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-3xl',
  };
  return (
    <div className={`${sizeClasses[size]} ${className} bg-white rounded-full flex items-center justify-center border-2 border-paper-dark shadow-sm`}>
      {avatar}
    </div>
  );
};

const MemberManagerModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  members: Member[]; 
  onUpdate: (members: Member[]) => void;
}> = ({ isOpen, onClose, members, onUpdate }) => {
  const [newName, setNewName] = useState('');
  if (!isOpen) return null;

  const addMember = () => {
    if (!newName.trim()) return;
    const randomAvatar = ANIMAL_AVATARS[Math.floor(Math.random() * ANIMAL_AVATARS.length)];
    const newMember: Member = { id: Date.now().toString(), name: newName.trim(), avatar: randomAvatar };
    onUpdate([...members, newMember]);
    setNewName('');
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) return;
    onUpdate(members.filter(m => m.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4">
      <div className="bg-paper w-full max-w-sm rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-primary">Manage Members</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-primary"><Icons.Trash /></button>
        </div>
        <div className="space-y-4 mb-6">
          {members.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 shadow-soft">
              <div className="flex items-center gap-3">
                <MemberAvatar avatar={m.avatar} size="md" />
                <span className="font-bold text-primary">{m.name}</span>
              </div>
              {members.length > 1 && (
                <button onClick={() => removeMember(m.id)} className="text-secondary/40 hover:text-secondary p-2"><Icons.Trash /></button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 bg-white border border-paper-dark rounded-xl px-4 py-3 text-sm focus:outline-none shadow-inner-soft" placeholder="Name..." value={newName} onChange={e => setNewName(e.target.value)} />
          <button onClick={addMember} className="bg-primary text-white p-3 rounded-xl shadow-soft"><Icons.Plus /></button>
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-paper-dark text-primary py-3 rounded-xl font-black uppercase text-xs tracking-widest">Done</button>
      </div>
    </div>
  );
};

// --- Modals ---

const EventFormModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (event: TravelEvent) => void; 
  onDelete?: (id: string) => void;
  initialData?: TravelEvent | null;
  defaultDate: string;
}> = ({ isOpen, onClose, onSave, onDelete, initialData, defaultDate }) => {
  const [formData, setFormData] = useState<Partial<TravelEvent>>({
    title: '', time: '12:00', type: EventType.SIGHTSEEING, location: '', description: '', date: defaultDate, photoUrl: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ title: '', time: '12:00', type: EventType.SIGHTSEEING, location: '', description: '', date: defaultDate, photoUrl: '' });
  }, [initialData, defaultDate, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photoUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-paper w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-primary">{initialData ? 'Edit Plan' : 'Add New Plan'}</h3>
          <button onClick={onClose} className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ id: initialData?.id || Date.now().toString(), ...(formData as TravelEvent) }); onClose(); }} className="space-y-4">
          <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Title</label><input required className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Where are we going?" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Time</label><input type="time" className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} /></div>
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Category</label><select className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as EventType})}>{Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Location</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Address or Venue Name" /></div>
          <div>
            <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Photo</label>
            <div onClick={() => fileInputRef.current?.click()} className="w-full h-24 border-2 border-dashed border-paper-dark rounded-xl flex flex-col items-center justify-center bg-white/50 cursor-pointer overflow-hidden">
              {formData.photoUrl ? <img src={formData.photoUrl} className="w-full h-full object-cover" /> : <><Icons.Upload /><span className="text-[10px] font-bold mt-1">Upload Photo</span></>}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>
          <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Note</label><textarea className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none resize-none" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Details, food to eat, tickets..." /></div>
          <div className="flex gap-3 pt-4">
            {initialData && onDelete && <button type="button" onClick={() => { onDelete(initialData.id); onClose(); }} className="flex-1 bg-secondary/10 text-secondary py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Delete</button>}
            <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-soft">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BookingFormModal: React.FC<{ 
  isOpen: boolean; onClose: () => void; onSave: (booking: Booking) => void; onDelete?: (id: string) => void; initialData?: Booking | null;
}> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [formData, setFormData] = useState<Partial<Booking>>({
    type: 'FLIGHT', title: '', subTitle: '', date: '2025-12-26', time: '12:00', referenceCode: '', price: '', location: '', endLocation: '', imageUrl: '', details: { flightNumber: '', seat: '' }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ type: 'FLIGHT', title: '', subTitle: '', date: '2025-12-26', time: '12:00', referenceCode: '', price: '', location: '', endLocation: '', imageUrl: '', details: { flightNumber: '', seat: '' } });
  }, [initialData, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-paper w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-primary">{initialData ? 'Edit Booking' : 'New Booking'}</h3>
          <button onClick={onClose} className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ id: initialData?.id || Date.now().toString(), ...(formData as Booking) }); onClose(); }} className="space-y-4">
          <div className="grid grid-cols-4 gap-2 p-1 bg-white border border-paper-dark rounded-xl">
            {['FLIGHT', 'HOTEL', 'TRAIN', 'TICKET'].map(t => (
               <button key={t} type="button" onClick={() => setFormData({...formData, type: t as any})} className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${formData.type === t ? 'bg-primary text-white' : 'text-gray-400'}`}>{t}</button>
            ))}
          </div>
          <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Main Title</label><input required className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="TPE to SFO / Hotel Name" /></div>
          <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Brand/Airline/Host</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.subTitle} onChange={e => setFormData({...formData, subTitle: e.target.value})} placeholder="United Airlines / Amtrak" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Date</label><input type="date" className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Time</label><input type="time" className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Origin/Loc</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="TPE / Address" /></div>
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Dest/End Date</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.endLocation || formData.endDate} onChange={e => setFormData({...formData, endLocation: e.target.value, endDate: e.target.value})} placeholder="SFO / YYYY-MM-DD" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Conf. Code</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.referenceCode} onChange={e => setFormData({...formData, referenceCode: e.target.value})} placeholder="PNR / Ticket #" /></div>
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Price</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="$ USD" /></div>
          </div>
          {(formData.type === 'FLIGHT' || formData.type === 'TRAIN') && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Flight/Train #</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.details?.flightNumber} onChange={e => setFormData({...formData, details: {...formData.details, flightNumber: e.target.value}})} /></div>
              <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Seat</label><input className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.details?.seat} onChange={e => setFormData({...formData, details: {...formData.details, seat: e.target.value}})} /></div>
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Booking Photo</label>
            <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-paper-dark rounded-xl flex flex-col items-center justify-center bg-white/50 cursor-pointer overflow-hidden">
              {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" /> : <><Icons.Upload /><span className="text-[10px] font-bold mt-1">Upload Photo</span></>}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            {initialData && onDelete && <button type="button" onClick={() => { onDelete(initialData.id); onClose(); }} className="flex-1 bg-secondary/10 text-secondary py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Delete</button>}
            <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-soft">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Fix for Error: Cannot find name 'ExpenseFormModal'.
const ExpenseFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onManageMembers: () => void;
  onSave: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  initialData?: Expense | null;
}> = ({ isOpen, onClose, members, onSave, onDelete, initialData }) => {
  const [formData, setFormData] = useState<Partial<Expense>>({
    amount: 0, currency: 'USD', category: '', date: new Date().toISOString().split('T')[0], payerId: members[0]?.id || '', splitBetween: members.map(m => m.id)
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ amount: 0, currency: 'USD', category: '', date: new Date().toISOString().split('T')[0], payerId: members[0]?.id || '', splitBetween: members.map(m => m.id) });
  }, [initialData, isOpen, members]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-paper w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-primary">{initialData ? 'Edit Expense' : 'Add Expense'}</h3>
          <button onClick={onClose} className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ id: initialData?.id || Date.now().toString(), ...(formData as Expense) }); onClose(); }} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Amount</label>
              <input type="number" required className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="w-24">
              <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Currency</label>
              <select className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value as 'USD' | 'TWD'})}>
                <option value="USD">USD</option>
                <option value="TWD">TWD</option>
              </select>
            </div>
          </div>
          <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Category</label><input required className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Food, Transport, Gift..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Date</label><input type="date" className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
            <div>
              <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Payer</label>
              <select className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.payerId} onChange={e => setFormData({...formData, payerId: e.target.value})}>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            {initialData && onDelete && <button type="button" onClick={() => { onDelete(initialData.id); onClose(); }} className="flex-1 bg-secondary/10 text-secondary py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Delete</button>}
            <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-soft">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Fix for Error: Cannot find name 'JournalFormModal'.
const JournalFormModal: React.FC<{
  members: Member[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
}> = ({ members, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    authorId: members[0]?.id || '', date: new Date().toISOString().split('T')[0], content: '', imageUrls: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ authorId: members[0]?.id || '', date: new Date().toISOString().split('T')[0], content: '', imageUrls: [] });
    }
  }, [isOpen, members]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, imageUrls: [...(prev.imageUrls || []), reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-paper w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-primary">New Memory</h3>
          <button onClick={onClose} className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ id: Date.now().toString(), ...(formData as JournalEntry) }); onClose(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Author</label>
              <select className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.authorId} onChange={e => setFormData({...formData, authorId: e.target.value})}>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div><label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Date</label><input type="date" className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Story</label>
            <textarea required className="w-full bg-white border border-paper-dark rounded-xl px-4 py-3 shadow-inner-soft focus:outline-none resize-none" rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="What happened today?" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 tracking-widest">Photos</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {formData.imageUrls?.map((url, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-paper-dark relative group">
                  <img src={url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData({...formData, imageUrls: formData.imageUrls?.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-secondary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Trash /></button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-paper-dark rounded-xl flex items-center justify-center bg-white/50 hover:bg-white transition-colors">
                <Icons.Plus />
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-soft mt-4">Save Memory</button>
        </form>
      </div>
    </div>
  );
};

// --- Pages ---

const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [events, setEvents] = useState<TravelEvent[]>(() => {
    const saved = localStorage.getItem('trippie_events');
    return saved ? JSON.parse(saved) : SEEDED_EVENTS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TravelEvent | null>(null);

  useEffect(() => { localStorage.setItem('trippie_events', JSON.stringify(events)); }, [events]);
  
  const dates = useMemo(() => {
    const list = [];
    let current = new Date(TRIP_START_DATE);
    const end = new Date(TRIP_END_DATE);
    while (current <= end) {
      list.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return list;
  }, []);

  const filteredEvents = useMemo(() => events.filter(e => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)), [selectedDate, events]);

  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-screen">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Unice's Trip 🗽</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Boston • NYC • Houston</p>
      </header>
      <div className="sticky top-0 bg-paper/95 backdrop-blur-sm z-20 pl-6 py-3 mb-4 border-b border-paper-dark/50 shadow-sm overflow-x-auto flex gap-3 no-scrollbar">
        {dates.map(date => {
          const isToday = new Date().toISOString().split('T')[0] === date;
          return (
            <button key={date} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-18 py-2 rounded-2xl border-2 transition-all ${selectedDate === date ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-paper-dark text-gray-400'} ${isToday && selectedDate !== date ? 'ring-2 ring-secondary' : ''}`}>
              <span className="text-[10px] uppercase font-extrabold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="text-xl font-black mt-1">{new Date(date).getDate()}</span>
              {isToday && <div className={`w-1 h-1 rounded-full mt-1 ${selectedDate === date ? 'bg-white' : 'bg-secondary'}`} />}
            </button>
          );
        })}
      </div>
      <div className="px-6">
        <div className="space-y-6 relative">
          <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-paper-dark -z-0" />
          {filteredEvents.length > 0 ? filteredEvents.map(event => (
            <div key={event.id} onClick={() => { setEditingEvent(event); setIsModalOpen(true); }} className="relative pl-8 group cursor-pointer">
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-paper bg-primary shadow-sm z-10" />
              <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 group-active:translate-x-1 group-active:translate-y-1 transition-all overflow-hidden">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{event.time}</span>
                  <span className="text-[10px] font-black text-primary/50 uppercase">{event.type}</span>
                </div>
                {event.photoUrl && (
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                    <img src={event.photoUrl} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-bold text-primary">{event.title}</h3>
                {event.location && <div className="flex items-center text-gray-400 text-[10px] font-bold mt-1"><Icons.Location /> <span className="ml-1">{event.location}</span></div>}
                {event.description && <div className="text-[11px] text-gray-500 mt-2 leading-relaxed whitespace-pre-wrap">{event.description}</div>}
              </div>
            </div>
          )) : <div className="text-center py-20 text-gray-400 italic">No plans for today. Relax!</div>}
        </div>
      </div>
      <button onClick={() => { setEditingEvent(null); setIsModalOpen(true); }} className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 border-4 border-white"><Icons.Plus /></button>
      <EventFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(ev) => editingEvent ? setEvents(events.map(e => e.id === ev.id ? ev : e)) : setEvents([...events, ev])} onDelete={(id) => setEvents(events.filter(e => e.id !== id))} initialData={editingEvent} defaultDate={selectedDate} />
    </div>
  );
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('trippie_bookings');
    return saved ? JSON.parse(saved) : SEEDED_BOOKINGS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => { localStorage.setItem('trippie_bookings', JSON.stringify(bookings)); }, [bookings]);

  const renderBoardingPass = (b: Booking) => (
    <div key={b.id} onClick={() => { setEditingBooking(b); setIsModalOpen(true); }} className="relative bg-white rounded-3xl shadow-soft overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
      <div className="p-5 pb-8 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{b.subTitle || b.type}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-primary">{b.date}</div>
        </div>
        <div className="flex justify-between items-center mb-2">
           <div className="w-[80px]">
             <div className="text-3xl font-black text-primary truncate uppercase">{b.location || '???'}</div>
             <div className="text-[10px] font-bold text-gray-300 uppercase">Origin</div>
           </div>
           <div className="flex-1 border-b-2 border-dashed border-gray-200 mx-4 relative top-[-6px]">
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
               <Icons.Plane />
             </div>
           </div>
           <div className="w-[80px] text-right">
             <div className="text-3xl font-black text-primary truncate uppercase">{b.endLocation || '???'}</div>
             <div className="text-[10px] font-bold text-gray-300 uppercase">Dest</div>
           </div>
        </div>
      </div>
      <div className="relative h-6 flex items-center justify-center">
        <div className="absolute left-[-12px] w-6 h-6 bg-paper rounded-full shadow-inner"></div>
        <div className="w-full border-t-2 border-dashed border-gray-100"></div>
        <div className="absolute right-[-12px] w-6 h-6 bg-paper rounded-full shadow-inner"></div>
      </div>
      <div className="p-5 pt-2">
         <div className="grid grid-cols-3 gap-4 mb-4">
           <div>
             <div className="text-[9px] font-bold text-gray-300 uppercase">Flight/T</div>
             <div className="font-black text-primary text-sm truncate">{b.details?.flightNumber || b.referenceCode || '-'}</div>
           </div>
           <div className="text-center">
             <div className="text-[9px] font-bold text-gray-300 uppercase">Time</div>
             <div className="font-black text-primary text-sm">{b.time}</div>
           </div>
           <div className="text-right">
             <div className="text-[9px] font-bold text-gray-300 uppercase">Seat</div>
             <div className="font-black text-primary text-sm">{b.details?.seat || 'ANY'}</div>
           </div>
         </div>
         <div className="h-10 bg-gray-50 rounded-lg flex items-center justify-center gap-[2px] opacity-10 overflow-hidden">
            {[...Array(60)].map((_, i) => <div key={i} className="h-full bg-black" style={{ width: Math.random() > 0.5 ? '2px' : '4px' }} />)}
         </div>
      </div>
    </div>
  );

  const renderGenericCard = (b: Booking) => (
    <div key={b.id} onClick={() => { setEditingBooking(b); setIsModalOpen(true); }} className="bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform">
      {b.imageUrl && <div className="h-32 w-full"><img src={b.imageUrl} className="w-full h-full object-cover" /></div>}
      <div className="p-5">
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-paper rounded-lg flex items-center justify-center text-primary">{b.type === 'HOTEL' ? '🏨' : '🎟️'}</div>
             <div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{b.type}</div>
               <h3 className="font-bold text-primary">{b.title}</h3>
               {b.location && <div className="text-[10px] text-gray-400 font-bold truncate max-w-[200px]">{b.location}</div>}
             </div>
           </div>
           <div className="text-right">
             <div className="text-xs font-bold text-primary">{b.date}</div>
             {b.price && <div className="text-[10px] text-marker-green font-black mt-1">{b.price}</div>}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-screen">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Bookings</h1>
      </header>
      <div className="px-6 space-y-4 mt-6">
        {bookings.map(b => (b.type === 'FLIGHT' || b.type === 'TRAIN') ? renderBoardingPass(b) : renderGenericCard(b))}
      </div>
      <button onClick={() => { setEditingBooking(null); setIsModalOpen(true); }} className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 border-4 border-white"><Icons.Plus /></button>
      <BookingFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(bk) => editingBooking ? setBookings(bookings.map(b => b.id === bk.id ? bk : b)) : setBookings([...bookings, bk])} onDelete={(id) => setBookings(bookings.filter(b => b.id !== id))} initialData={editingBooking} />
    </div>
  );
};

const ExpensePage: React.FC<{ members: Member[]; onUpdateMembers: (m: Member[]) => void }> = ({ members, onUpdateMembers }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('trippie_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  useEffect(() => { localStorage.setItem('trippie_expenses', JSON.stringify(expenses)); }, [expenses]);
  const dailyTotals = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      const val = e.currency === 'USD' ? e.amount * EXCHANGE_RATE : e.amount;
      map[e.date] = (map[e.date] || 0) + val;
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses]);

  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-screen">
      <header className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Expense</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Multi-currency Tracker</p>
        </div>
        <button onClick={() => setIsMemberModalOpen(true)} className="p-3 bg-white border border-paper-dark rounded-2xl shadow-soft text-primary active:shadow-none transition-all"><Icons.Users /></button>
      </header>
      <div className="px-6 mb-8">
        <div className="bg-secondary text-white p-6 rounded-3xl shadow-soft">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Total Trip Spent</div>
          <div className="text-4xl font-black">NT$ {expenses.reduce((s, e) => s + (e.currency === 'USD' ? e.amount * EXCHANGE_RATE : e.amount), 0).toLocaleString()}</div>
        </div>
      </div>
      <div className="px-6 space-y-6">
        {dailyTotals.map(([date, total]) => (
          <div key={date}>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{date}</h3>
              <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Total: NT$ {total.toLocaleString()}</span>
            </div>
            <div className="space-y-3">
              {expenses.filter(e => e.date === date).map(item => (
                <div key={item.id} onClick={() => { setEditingExpense(item); setIsModalOpen(true); }} className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 flex justify-between items-center cursor-pointer group hover:border-primary/20 transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <MemberAvatar avatar={members.find(m => m.id === item.payerId)?.avatar || '❓'} size="sm" />
                    <div>
                      <div className="font-bold text-sm text-primary">{item.category}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid by {members.find(m => m.id === item.payerId)?.name || 'Someone'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-primary">{item.currency} {item.amount.toLocaleString()}</div>
                    <div className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Est. NT$ {(item.currency === 'USD' ? item.amount * EXCHANGE_RATE : item.amount).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 border-4 border-white"><Icons.Plus /></button>
      <ExpenseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} members={members} onManageMembers={() => setIsMemberModalOpen(true)} onSave={(e) => editingExpense ? setExpenses(expenses.map(ex => ex.id === e.id ? e : ex)) : setExpenses([e, ...expenses])} onDelete={(id) => setExpenses(expenses.filter(e => e.id !== id))} initialData={editingExpense} />
      <MemberManagerModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} members={members} onUpdate={onUpdateMembers} />
    </div>
  );
};

const JournalPage: React.FC<{ members: Member[] }> = ({ members }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('trippie_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => { localStorage.setItem('trippie_journal', JSON.stringify(entries)); }, [entries]);
  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-screen">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Journal</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Moments in Time</p>
      </header>
      <div className="px-6 space-y-8 mt-4">
        {entries.length === 0 ? <div className="text-center py-20 text-gray-400 italic">No stories yet. Start writing!</div> : entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100 group">
            <div className="p-4 flex items-center gap-3">
              <MemberAvatar avatar={members.find(m => m.id === entry.authorId)?.avatar || '❓'} size="sm" />
              <div>
                <div className="font-black text-sm text-primary">{members.find(m => m.id === entry.authorId)?.name || 'Someone'}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{entry.date}</div>
              </div>
            </div>
            {entry.imageUrls.length > 0 && (
              <div className={`grid gap-1 ${entry.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {entry.imageUrls.map((url, i) => <img key={i} src={url} className="w-full aspect-square object-cover" />)}
              </div>
            )}
            <div className="p-4"><p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">{entry.content}</p></div>
          </div>
        ))}
      </div>
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 border-4 border-white"><Icons.Camera /></button>
      <JournalFormModal members={members} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(e) => setEntries([e, ...entries])} />
    </div>
  );
};

const PlanningPage: React.FC = () => {
  const [items, setItems] = useState<PlanningItem[]>(() => {
    const saved = localStorage.getItem('trippie_planning');
    return saved ? JSON.parse(saved) : [];
  });
  const [tab, setTab] = useState<'TODO' | 'PACKING' | 'SHOPPING'>('TODO');
  const [input, setInput] = useState('');
  useEffect(() => { localStorage.setItem('trippie_planning', JSON.stringify(items)); }, [items]);
  return (
    <div className="pb-32 animate-in fade-in duration-500 min-h-screen">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Planning</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Get Ready for NY</p>
      </header>
      <div className="px-6 mt-4">
        <div className="flex gap-2 p-1 bg-paper-dark/20 rounded-2xl mb-6">
          {['TODO', 'PACKING', 'SHOPPING'].map(t => <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${tab === t ? 'bg-primary text-white shadow-soft' : 'text-gray-400'}`}>{t}</button>)}
        </div>
        <form onSubmit={e => { e.preventDefault(); if (input.trim()) setItems([...items, { id: Date.now().toString(), type: tab, text: input, completed: false }]); setInput(''); }} className="relative mb-6">
          <input className="w-full bg-white border border-paper-dark rounded-2xl px-5 py-4 shadow-soft focus:outline-none pr-14 text-sm font-bold" placeholder={`Add to ${tab.toLowerCase()}...`} value={input} onChange={e => setInput(e.target.value)} />
          <button type="submit" className="absolute right-3 top-2.5 w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center"><Icons.Plus /></button>
        </form>
        <div className="space-y-3">
          {items.filter(i => i.type === tab).map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 group">
              <button onClick={() => setItems(items.map(i => i.id === item.id ? {...i, completed: !i.completed} : i))} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-marker-green border-marker-green text-white' : 'border-paper-dark'}`}>{item.completed && <Icons.Check />}</button>
              <span className={`flex-1 text-sm font-bold ${item.completed ? 'text-gray-300 line-through' : 'text-primary'}`}>{item.text}</span>
              <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Trash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Icons.Schedule, label: 'Schedule' },
    { path: '/bookings', icon: Icons.Bookings, label: 'Bookings' },
    { path: '/expense', icon: Icons.Expense, label: 'Expense' },
    { path: '/journal', icon: Icons.Journal, label: 'Journal' },
    { path: '/planning', icon: Icons.Planning, label: 'Planning' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-paper-dark pb-safe pt-2 px-4 shadow-lg z-50">
      <div className="flex justify-between items-end max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path} className={`flex flex-col items-center p-2 min-w-[60px] transition-all ${isActive ? 'text-primary -translate-y-2' : 'text-gray-400'}`}>
              <div className={`p-2.5 rounded-2xl transition-all ${isActive ? 'bg-paper shadow-soft text-primary' : 'bg-transparent'}`}><item.icon /></div>
              <span className={`text-[10px] font-bold mt-1 transition-all ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('trippie_members');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });
  const updateMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem('trippie_members', JSON.stringify(newMembers));
  };
  return (
    <HashRouter>
      <div className="min-h-screen bg-paper font-sans text-primary max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-paper-dark/30">
        <Routes>
          <Route path="/" element={<SchedulePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/expense" element={<ExpensePage members={members} onUpdateMembers={updateMembers} />} />
          <Route path="/journal" element={<JournalPage members={members} />} />
          <Route path="/planning" element={<PlanningPage />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
