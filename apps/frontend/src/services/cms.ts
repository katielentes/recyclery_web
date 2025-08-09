// CMS API Service for Strapi integration
const CMS_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:1337';

export interface CMSMediaFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface CMSMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: CMSMediaFormat;
      small?: CMSMediaFormat;
      medium?: CMSMediaFormat;
      large?: CMSMediaFormat;
    };
    url: string;
  };
}

export interface CMSProgram {
  id: number;
  documentId: string;
  title: string;
  content?: any; // Rich text blocks from Strapi v5 (short content for Program component)
  contentLong?: any; // Rich text blocks for detailed/long content
  shortDescription?: string;
  header?: string;
  learnMoreLink?: string; // New field for Program component compatibility
  slug?: string;
  programType?: 'open-shop' | 'freecyclery' | 'ftwnb' | 'classes';
  heroImage?: CMSMedia;
  order?: number; // For controlling display order
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CMSResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

class CMSService {
  private async fetchFromCMS<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${CMS_BASE_URL}/api${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`CMS API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('CMS API Error:', error);
      throw error;
    }
  }

  // Get all programs
  async getPrograms(): Promise<CMSProgram[]> {
    const response = await this.fetchFromCMS<CMSResponse<CMSProgram[]>>('/programs?populate=*&sort=order:asc');
    return response.data;
  }

  // Get single program by ID
  async getProgram(id: number): Promise<CMSProgram> {
    const response = await this.fetchFromCMS<CMSResponse<CMSProgram>>(`/programs/${id}`);
    return response.data;
  }

  // Get programs with populated relations (images, etc.)
  async getProgramsWithDetails(): Promise<CMSProgram[]> {
    const response = await this.fetchFromCMS<CMSResponse<CMSProgram[]>>('/programs?populate=*');
    return response.data;
  }
}

export const cmsService = new CMSService();
export default cmsService;
