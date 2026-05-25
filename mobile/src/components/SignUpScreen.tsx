
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useAuthStore, useUIStore } from '../store';
import { Mail, Lock, User, Phone, Circle, AlertCircle, Eye, EyeOff } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { tw } from '../lib/native-utils';

// ─── Password policy ────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number (0–9)', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$…)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

type StrengthLevel = 'weak' | 'medium' | 'strong';

function getPasswordStrength(password: string): { level: StrengthLevel; score: number } {
  if (!password) return { level: 'weak', score: 0 };
  const score = PASSWORD_RULES.filter(r => r.test(password)).length;
  const level: StrengthLevel = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
  return { level, score };
}

const STRENGTH_CONFIG: Record<StrengthLevel, { label: string; color: string; bars: number }> = {
  weak: { label: 'Weak', color: '#EF4444', bars: 1 },
  medium: { label: 'Medium', color: '#F59E0B', bars: 3 },
  strong: { label: 'Strong', color: '#10B981', bars: 5 },
};

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { level: strengthLevel, score: strengthScore } = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const login = useAuthStore((state) => state.login);
  const setActiveScreen = useUIStore((state) => state.setActiveScreen);

  const handleSignUp = () => {
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

    // Enforce password policy on sign-up
    const failedRules = PASSWORD_RULES.filter(r => !r.test(password));
    if (failedRules.length > 0) {
      setError(`password must include: ${failedRules.map(r => r.label.toLowerCase()).join(', ')}.`);
      return;
    }

    if (password !== confirmPassword) {
      setError('passwords do not match. please try again.');
      return;
    }

    login(email, 'Client');
    setActiveScreen('HOME');
  };

  // Formatted component
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
          <View style={tw`gap-1.5`}>
            <Input
              label="Password"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconPress={() => setShowPassword(!showPassword)}
              placeholder="create a password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            {/* ── Password strength indicator ── */}
            {password.length > 0 && (
              <View style={tw`mt-1 gap-1.5`}>
                {/* Strength bars */}
                <View style={tw`flex-row gap-1`}>
                  {[1, 2, 3, 4, 5].map(bar => (
                    <View
                      key={bar}
                      style={[
                        tw`flex-1 h-1 rounded-full`,
                        {
                          backgroundColor:
                            bar <= STRENGTH_CONFIG[strengthLevel].bars
                              ? STRENGTH_CONFIG[strengthLevel].color
                              : '#E5E7EB',
                        },
                      ]}
                    />
                  ))}
                </View>

                {/* Strength label */}
                <Text
                  style={[
                    tw`text-xs font-semibold ml-0.5`,
                    { color: STRENGTH_CONFIG[strengthLevel].color },
                  ]}
                >
                  {STRENGTH_CONFIG[strengthLevel].label} password
                </Text>

                {/* Unmet rule hints */}
                {PASSWORD_RULES.filter(r => !r.test(password)).map(rule => (
                  <View key={rule.label} style={tw`flex-row items-center gap-1.5`}>
                    <AlertCircle color="#9CA3AF" size={11} />
                    <Text style={tw`text-[10px] text-gray-400`}>{rule.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <Input
            label="Confirm Password"
            icon={Lock}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="confirm your password"
            secureTextEntry={!showConfirmPassword}
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
            <SocialButton imageSource={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} label="Google" />
            <SocialButton imageSource={{ uri: 'https://img.icons8.com/ios-filled/50/000000/mac-os.png' }} label="Apple" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Input({ label, icon: Icon, rightIcon: RightIcon, onRightIconPress, ...props }: any) {
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
          style={[tw`w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 text-gray-900 text-sm`, RightIcon ? tw`pr-12` : tw`pr-4`]}
        />
        {RightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={tw`absolute right-4 top-4 z-10`}
          >
            <RightIcon color="#9CA3AF" size={18} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function SocialButton({ icon: Icon, imageSource, label }: any) {
  return (
    <TouchableOpacity style={tw`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border border-gray-200`}>
      {imageSource ? (
        <Image source={imageSource} style={tw`w-5 h-5`} resizeMode="contain" />
      ) : (
        <Icon color="#000" size={20} />
      )}
      <Text style={tw`text-xs font-semibold`}>{label}</Text>
    </TouchableOpacity>
  );
}

