import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })
export const config = {
    port: process.env.PORT,
    secret_access_token: process.env.SECRET_ACCESS_TOKEN
}