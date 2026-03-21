// Test script to verify auth integration
import { authService } from '../services/authService';

export const testAuthIntegration = async () => {
  console.log('🧪 Testing Auth Integration...');
  
  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const registerResponse = await authService.register(registerData);
    console.log('✅ Registration Response:', registerResponse);
    
    // Test 2: Login with the user
    console.log('2️⃣ Testing Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const loginResponse = await authService.login(loginData);
    console.log('✅ Login Response:', loginResponse);
    
    if (loginResponse.success && loginResponse.token) {
      // Test 3: Get current user profile
      console.log('3️⃣ Testing Get Current User...');
      const profileResponse = await authService.getCurrentUser();
      console.log('✅ Profile Response:', profileResponse);
      
      // Test 4: Logout
      console.log('4️⃣ Testing Logout...');
      const logoutResponse = await authService.logout();
      console.log('✅ Logout Response:', logoutResponse);
    }
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Export for manual testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testAuthIntegration = testAuthIntegration;
}
