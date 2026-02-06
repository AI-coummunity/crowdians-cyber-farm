// Waitlist service for collecting emails via Google Sheets API
// This uses Google Apps Script Web App as a simple backend

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

export interface WaitlistSubmission {
  email: string;
  timestamp?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Submit an email to the waitlist
 * @param email - User's email address
 * @returns Promise with submission result
 */
export async function submitToWaitlist(email: string): Promise<WaitlistResponse> {
  try {
    // Validate email format
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: '유효한 이메일 주소를 입력해주세요.',
      };
    }

    // If no Google Script URL is configured, simulate success for development
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('Google Script URL not configured. Simulating success...');
      console.log('Email submitted:', email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: '출시 알림 신청이 완료되었습니다!',
      };
    }

    // Submit to Google Sheets via Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        
      }),
    });

    // Note: With no-cors, we can't read the response
    // We assume success if no error was thrown
    return {
      success: true,
      message: '출시 알림 신청이 완료되었습니다!',
    };
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return {
      success: false,
      error: '신청 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
