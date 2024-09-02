import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js*",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://atmalviya_owner:BHn9Ud8ezCVh@ep-falling-sunset-a1cea93s.ap-southeast-1.aws.neon.tech/FormBuilder?sslmode=require',
  }
});