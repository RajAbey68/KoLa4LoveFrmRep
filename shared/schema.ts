// Firebase document interfaces (replacing PostgreSQL tables)

export interface AuthorizedContact {
  id?: string;
  name: string;
  title?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  lastVerified?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CmsContent {
  id?: string;
  type: string; // page type or content type
  title?: string;
  content?: string;
  description?: string;
  keywords?: string[];
  amenities?: string[];
  gallery?: string[];
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeoMeta {
  id?: string;
  pagePath: string;
  title?: string;
  description?: string;
  keywords?: string[];
  focusKeywords?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiUsage {
  id?: string;
  service: string; // openai, firebase
  endpoint?: string;
  tokensUsed?: number;
  cost?: number; // in cents
  status: string; // success, error
  errorMessage?: string;
  createdAt?: Date;
}

export interface GalleryImage {
  id?: string;
  filename: string;
  originalName?: string;
  objectPath: string;
  mimeType?: string;
  size?: number;
  title?: string;
  description?: string;
  altText?: string;
  tags?: string[];
  category?: string;
  mediaType?: 'image' | 'video';
  thumbnailPath?: string;
  isHero?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  uploadedBy?: string;
  confidenceScore?: number;
  keywords?: string[];
  seoDescription?: string;
  analysisStatus?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Ko Lake Life - Local events, news and special offers
export interface KoLakeLife {
  id?: string;
  title: string;
  description: string;
  content?: string; // Full content/article text
  type: string; // 'event', 'news', 'offer', 'cricket'
  category?: string; // e.g., 'cultural', 'dining', 'activities', 'announcements', 'cricket', 'sports'
  location?: string; // For local areas: 'ahanagama', 'kogalla', 'weligama', 'galle'
  imageUrl?: string; // Featured image
  externalUrl?: string; // Link to Facebook, full article, etc.
  startDate?: Date; // For events and offers
  endDate?: Date; // For events and offers
  tags?: string[]; // Tags for categorization and filtering
  isActive?: boolean;
  isFeatured?: boolean; // Highlight important items
  status: string; // 'draft', 'review', 'published', 'archived'
  publishedAt?: Date; // When content was published
  reviewedBy?: string; // Admin user who reviewed/published
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Role {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Firebase collection names
export const COLLECTIONS = {
  SEO_META: 'seo_meta',
  API_USAGE: 'api_usage',
  GALLERY_IMAGES: 'gallery_images',
  KO_LAKE_LIFE: 'ko_lake_life',
  USERS: 'users',
  ROLES: 'roles',
  AUTHORIZED_CONTACTS: 'authorized_contacts',
  CMS_CONTENT: 'cms_content'
} as const;

// Legacy exports for deployment compatibility
export const authorizedContacts = COLLECTIONS.AUTHORIZED_CONTACTS;
export const cmsContent = COLLECTIONS.CMS_CONTENT;
export const koLakeLife = COLLECTIONS.KO_LAKE_LIFE;
export const galleryImages = COLLECTIONS.GALLERY_IMAGES;