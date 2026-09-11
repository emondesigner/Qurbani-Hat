import React, { useState, useEffect } from 'react';
import { Animal, BookingFormData, BookingFormErrors } from '../types';
import { useAuth } from '../lib/auth-context';
import { Link, useRouter } from '../lib/router-context';
import { toast } from 'sonner';
import { 
  Lock, 
  Send, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BookingFormProps {
  animal: Animal;
}

export function BookingForm({ animal }: BookingFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanedPhone = formData.phone.replace(/[\s-]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    } else if (cleanedPhone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number (at least 8 digits)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery / Farm contact address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted errors before submitting.');
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BookingFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate booking submission delay
    await new Promise(r => setTimeout(r, 800));

    // CRITICAL ASSIGNMENT REQUIREMENT:
    // 1. Show success toast: "Booking request submitted successfully!"
    // 2. Reset all form fields
    // 3. Keep user on details page
    // 4. Do NOT create an order / payment / persist to DB or localStorage!
    toast.success('Booking request submitted successfully!', {
      description: `Your reservation request for ${animal.name} (Tag #${animal.id}) has been received.`
    });

    // Reset form fields
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: ''
    });
    setErrors({});
    setIsSubmitting(false);
  };

  // If user is logged out, show login-required state
  if (!isAuthenticated) {
    return (
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Authentication Required</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            You must be logged in to book this animal. Please sign in or create an account to proceed with your booking request.
          </p>
        </div>
        <Link
          href={`/login?redirect=/details-page/${animal.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          id="booking-login-required-btn"
        >
          <User className="w-4 h-4" />
          <span>Login to Book Animal</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg p-6 sm:p-8">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h3 className="text-xl font-extrabold text-slate-900 font-serif">
              Book This Animal
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Active Booking Form
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Reserve <strong className="text-slate-800">{animal.name}</strong> directly. Fill out your delivery and contact preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* Full Name */}
        <div>
          <label htmlFor="booking-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="booking-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mohammad Tanvir"
              className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden transition-all ${
                errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="booking-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              id="booking-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. tanvir@example.com"
              className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden transition-all ${
                errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="booking-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              id="booking-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +880 1712-345678"
              className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden transition-all ${
                errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="booking-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Delivery / Contact Address *
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <textarea
              id="booking-address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. House 42, Road 7, Dhanmondi, Dhaka"
              className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden transition-all resize-none ${
                errors.address ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.address}</span>
            </p>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            id="booking-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Booking Request</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          * Demo Notice: This booking form simulates livestock reservation without charging payments or saving to databases.
        </p>
      </form>
    </div>
  );
}
