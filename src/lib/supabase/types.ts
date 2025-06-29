export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          subscription_status: 'active' | 'canceled' | 'past_due' | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      security_analyses: {
        Row: {
          id: string
          user_id: string
          system_description: string
          analysis_type: 'quick' | 'detailed'
          result: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          system_description: string
          analysis_type: 'quick' | 'detailed'
          result: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          system_description?: string
          analysis_type?: 'quick' | 'detailed'
          result?: any
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          action: string
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          metadata?: any
          created_at?: string
        }
      }
    }
  }
}