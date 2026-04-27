/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_R60mYdjBNphi@ep-cold-cake-an9vkpvn.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require',
    }
};