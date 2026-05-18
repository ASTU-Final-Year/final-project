
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuthStore, useUIStore } from '../store';
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { tw } from '../lib/native-utils';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const setActiveScreen = useUIStore((state) => state.setActiveScreen);

  const handleLogin = () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    login(email, 'Client');
    setActiveScreen('HOME');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
      <ScrollView contentContainerStyle={tw`p-8 flex-grow`} keyboardShouldPersistTaps="handled">
        <View style={tw`mt-12 mb-10`}>
          <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>Welcome Back!</Text>
          <Text style={tw`text-gray-500`}>Sign in to track your service progress</Text>
        </View>

        {error ? (
          <View style={tw`bg-red-50 p-4 rounded-2xl border border-red-100 mb-6`}>
            <Text style={tw`text-red-600 text-xs font-medium`}>{error}</Text>
          </View>
        ) : null}

        <View style={tw`flex-row bg-gray-100 p-1 rounded-xl mb-8`}>
          <TouchableOpacity 
            style={tw`flex-1 py-2.5 bg-white shadow-sm rounded-lg items-center`}
          >
            <Text style={tw`text-sm font-semibold text-blue-600`}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              console.log('Switching to SIGNUP');
              setActiveScreen('SIGNUP');
            }}
            style={tw`flex-1 py-2.5 items-center`}
          >
            <Text style={tw`text-sm font-semibold text-gray-500`}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`gap-4`}>
          <View style={tw`gap-1.5`}>
            <Text style={tw`text-xs font-semibold text-gray-700 ml-1`}>Email</Text>
            <View style={tw`relative`}>
              <View style={tw`absolute left-4 top-4.5 z-10`}>
                <Mail color="#9CA3AF" size={18} />
              </View>
              <TextInput
                style={tw`w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900`}
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={tw`gap-1.5`}>
            <View style={tw`flex-row justify-between items-center ml-1`}>
              <Text style={tw`text-xs font-semibold text-gray-700`}>Password</Text>
              <TouchableOpacity>
                <Text style={tw`text-xs font-bold text-blue-600`}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`relative`}>
              <View style={tw`absolute left-4 top-4.5 z-10`}>
                <Lock color="#9CA3AF" size={18} />
              </View>
              <TextInput
                style={tw`w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-gray-900`}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={tw`absolute right-4 top-4.5 z-10`}
              >
                {showPassword ? <EyeOff color="#9CA3AF" size={18} /> : <Eye color="#9CA3AF" size={18} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleLogin}
            style={tw`w-full bg-blue-600 py-4 rounded-2xl shadow-lg shadow-blue-200 mt-4 items-center`}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white font-bold text-base`}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`mt-auto pt-8`}>
          <View style={tw`bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6`}>
             <View style={tw`flex-row items-center gap-2 mb-1`}>
               <CheckCircle color="#1E40AF" size={14} />
               <Text style={tw`text-[10px] font-bold uppercase tracking-wider text-blue-800`}>Demo Credentials</Text>
             </View>
             <Text style={tw`text-xs text-blue-600`}>Email: <Text style={tw`font-bold`}>admin@sync.com</Text></Text>
             <Text style={tw`text-xs text-blue-600`}>Password: <Text style={tw`font-bold`}>password123</Text></Text>
          </View>
          
          <Text style={tw`text-[10px] text-center text-gray-400`}>
            By signing in you agree to our <Text style={tw`text-gray-600 underline`}>Privacy Policy</Text> and <Text style={tw`text-gray-600 underline`}>Terms of Service</Text>.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
