
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore, useUIStore } from '../store';
import { Mail, Lock, User, Phone, Circle } from 'lucide-react-native';
import { tw } from '../lib/native-utils';
import { apiClient } from '../lib/apiClient';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const setActiveScreen = useUIStore((state) => state.setActiveScreen);

  const handleSignUp = async () => {
    setError('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('all fields are required to create an account.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('please enter a valid @ email address.');
      return;
    }

    if (password.length < 6) {
      setError('password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('passwords do not match. please try again.');
      return;
    }

    const [firstname, ...lastnames] = name.trim().split(' ');
    const lastname = lastnames.length > 0 ? lastnames.join(' ') : 'User';

    try {
      const response = await apiClient('/query/v1/user', {
        method: 'POST',
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          phone,
          password,
          gender: 'U',
          role: 'client'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData.message || 'Registration failed.');
        return;
      }

      // Auto login after signup
      const sessionResponse = await apiClient('/query/v1/session', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (sessionResponse.ok) {
        const data = await sessionResponse.json();
        const session = data.sessions?.[0] || data.session?.[0] || data;
        const user = session?.user || data.user;
        login(email, user?.role || 'client');
        setActiveScreen('HOME');
      } else {
        setActiveScreen('LOGIN');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-8 flex-grow`} keyboardShouldPersistTaps="handled">
        <View style={tw`mt-8 mb-6`}>
          <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>Create Account</Text>
          <Text style={tw`text-gray-500`}>Join ServeSync+ to start tracking</Text>
        </View>

        {error ? (
          <View style={tw`bg-red-50 p-4 rounded-2xl border border-red-100 mb-6`}>
            <Text style={tw`text-red-600 text-xs font-medium`}>{error}</Text>
          </View>
        ) : null}

        <View style={tw`flex-row bg-gray-100 p-1 rounded-xl mb-6`}>
          <TouchableOpacity 
            onPress={() => setActiveScreen('LOGIN')}
            style={tw`flex-1 py-2.5 items-center`}
          >
            <Text style={tw`text-sm font-semibold text-gray-500`}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`flex-1 py-2.5 bg-white shadow-sm rounded-lg items-center`}
          >
            <Text style={tw`text-sm font-semibold text-blue-600`}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`gap-4 pb-8`}>
          <Input 
            label="Full Name" 
            icon={User} 
            placeholder="enter your full name"
            value={name}
            onChangeText={setName}
          />
          <Input 
            label="Email Address" 
            icon={Mail} 
            placeholder="enter your email address" 
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input 
            label="Phone Number" 
            icon={Phone} 
            placeholder="enter your phone number" 
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Input 
            label="Password" 
            icon={Lock} 
            placeholder="create a password" 
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input 
            label="Confirm Password" 
            icon={Lock} 
            placeholder="confirm your password" 
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity 
            onPress={handleSignUp}
            style={tw`w-full bg-blue-600 py-4 rounded-2xl shadow-lg shadow-blue-200 mt-4 items-center`}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white font-bold text-base`}>Create Account</Text>
          </TouchableOpacity>

          <View style={tw`flex-row items-center gap-4 py-4`}>
            <View style={tw`flex-1 h-[1.5px] bg-gray-100`} />
            <Text style={tw`text-[10px] uppercase font-bold text-gray-400 tracking-widest`}>Or continue with</Text>
            <View style={tw`flex-1 h-[1.5px] bg-gray-100`} />
          </View>

          <View style={tw`flex-row gap-4`}>
            <SocialButton icon={Circle} label="Google" />
            <SocialButton icon={Circle} label="Apple" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Input({ label, icon: Icon, ...props }: any) {
  return (
    <View style={tw`gap-1.5`}>
      {label && <Text style={tw`text-xs font-semibold text-gray-700 ml-1`}>{label}</Text>}
      <View style={tw`relative`}>
        <View style={tw`absolute left-4 top-4 z-10`}>
          <Icon color="#9CA3AF" size={18} />
        </View>
        <TextInput
          {...props}
          placeholderTextColor="#9CA3AF"
          style={tw`w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 text-sm`}
        />
      </View>
    </View>
  );
}

function SocialButton({ icon: Icon, label }: any) {
  return (
    <TouchableOpacity style={tw`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border border-gray-200`}>
      <Icon color="#000" size={20} />
      <Text style={tw`text-xs font-semibold`}>{label}</Text>
    </TouchableOpacity>
  );
}

