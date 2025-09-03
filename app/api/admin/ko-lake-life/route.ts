import { NextRequest, NextResponse } from 'next/server';
import { koLakeLifeRepo } from '@/lib/firebase/repositories';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('active');
    
    const conditions = [];
    if (type) {
      conditions.push({ field: 'type', operator: '==', value: type });
    }
    if (isActive !== null) {
      conditions.push({ field: 'isActive', operator: '==', value: isActive === 'true' });
    }
    
    let items = await koLakeLifeRepo.list();
    
    // Apply filtering conditions
    if (type) {
      items = items.filter((item: any) => item.type === type);
    }
    if (isActive !== null) {
      items = items.filter((item: any) => item.isActive === (isActive === 'true'));
    }
    
    // Sort items by displayOrder and createdAt
    items = items.sort((a: any, b: any) => {
      const aOrder = a.displayOrder || 0;
      const bOrder = b.displayOrder || 0;
      if (aOrder !== bOrder) return bOrder - aOrder;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    
    return NextResponse.json({
      success: true,
      data: items
    });
    
  } catch (error) {
    console.error('Error fetching Ko Lake Life items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation and data processing
    const dataToInsert = {
      ...body,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      status: body.status || 'draft'
    };

    const itemId = await koLakeLifeRepo.create(dataToInsert);
    const newItem = { id: itemId, ...dataToInsert };
    
    return NextResponse.json({
      success: true,
      data: newItem
    });
    
  } catch (error) {
    console.error('Error creating Ko Lake Life item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for updates' },
        { status: 400 }
      );
    }
    
    // Check if item exists
    const existingItem = await koLakeLifeRepo.getById(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    await koLakeLifeRepo.update(id, updateData);
    const updatedItem = await koLakeLifeRepo.getById(id);
    
    return NextResponse.json({
      success: true,
      data: updatedItem
    });
    
  } catch (error) {
    console.error('Error updating Ko Lake Life item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    // Check if item exists
    const existingItem = await koLakeLifeRepo.getById(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    await koLakeLifeRepo.delete(id);
    
    return NextResponse.json({
      success: true,
      data: existingItem
    });
    
  } catch (error) {
    console.error('Error deleting Ko Lake Life item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}