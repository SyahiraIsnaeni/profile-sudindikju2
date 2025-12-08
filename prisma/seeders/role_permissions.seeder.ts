import { PrismaClient } from '@prisma/client';

export async function seedRolePermissions(prisma: PrismaClient) {
  try {
    console.log('📝 Seeding role permissions...');

    // Get all roles
    const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
    const kasudinRole = await prisma.role.findUnique({ where: { name: 'kasudin' } });
    const kasubbagRole = await prisma.role.findUnique({ where: { name: 'kasubbag' } });
    const kasiRole = await prisma.role.findUnique({ where: { name: 'kasi' } });
    const stafRole = await prisma.role.findUnique({ where: { name: 'staf' } });

    const allPermissions = await prisma.permission.findMany();

    // Admin: all permissions
    if (adminRole) {
      for (const permission of allPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: adminRole.id,
              permission_id: permission.id,
            },
          },
          update: {},
          create: {
            role_id: adminRole.id,
            permission_id: permission.id,
          },
        });
      }
      console.log(`  ✓ Assigned ${allPermissions.length} permissions to admin`);
    }

    // Kasudin (Kepala Sudin): View, Create, Edit Master Data & Dashboard
    if (kasudinRole) {
      const kasudinPermissions = allPermissions.filter((p) =>
        (p.name === 'Master Data' && ['view_master_data'].includes(p.detail)) ||
        (p.name === 'Dashboard' && p.detail === 'view_dashboard')
      );

      for (const permission of kasudinPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: kasudinRole.id,
              permission_id: permission.id,
            },
          },
          update: {},
          create: {
            role_id: kasudinRole.id,
            permission_id: permission.id,
          },
        });
      }
      console.log(`  ✓ Assigned ${kasudinPermissions.length} permissions to kasudin`);
    }

    // Kasubbag (Kepala Sub Bagian): View, Create, Edit Master Data
    if (kasubbagRole) {
      const kasubbagPermissions = allPermissions.filter((p) =>
        (p.name === 'Master Data' && ['view_master_data'].includes(p.detail)) ||
        (p.name === 'Dashboard' && p.detail === 'view_dashboard')
      );

      for (const permission of kasubbagPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: kasubbagRole.id,
              permission_id: permission.id,
            },
          },
          update: {},
          create: {
            role_id: kasubbagRole.id,
            permission_id: permission.id,
          },
        });
      }
      console.log(`  ✓ Assigned ${kasubbagPermissions.length} permissions to kasubbag`);
    }

    // Kasi (Kepala Seksi): View Master Data & Dashboard only
    if (kasiRole) {
      const kasiPermissions = allPermissions.filter((p) =>
        (p.name === 'Master Data' && p.detail === 'view_master_data') ||
        (p.name === 'Dashboard' && p.detail === 'view_dashboard')
      );

      for (const permission of kasiPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: kasiRole.id,
              permission_id: permission.id,
            },
          },
          update: {},
          create: {
            role_id: kasiRole.id,
            permission_id: permission.id,
          },
        });
      }
      console.log(`  ✓ Assigned ${kasiPermissions.length} permissions to kasi`);
    }

    // Staf: View Dashboard only
    if (stafRole) {
      const stafPermissions = allPermissions.filter((p) =>
        p.name === 'Dashboard' && p.detail === 'view_dashboard'
      );

      for (const permission of stafPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            role_id_permission_id: {
              role_id: stafRole.id,
              permission_id: permission.id,
            },
          },
          update: {},
          create: {
            role_id: stafRole.id,
            permission_id: permission.id,
          },
        });
      }
      console.log(`  ✓ Assigned ${stafPermissions.length} permissions to staf`);
    }

    console.log('✅ Role permissions seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding role permissions:', error);
    throw error;
  }
}