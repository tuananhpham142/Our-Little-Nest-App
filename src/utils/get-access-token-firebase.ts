/** @format */
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const auth = new GoogleAuth({
    // Ở đây dùng __dirname để nó lấy đường dẫn tuyệt đối
    keyFile: path.join(
        __dirname,
        'config',
        'carbooking-b75fd-firebase-adminsdk-aq08r-897377be66.json',
    ),
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});
async function getAccessToken() {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    if (tokenResponse && tokenResponse.token) {
        console.log('Access Token:', tokenResponse.token);
        return tokenResponse.token;
    } else {
        throw new Error('Đéo lấy được access token');
    }
}
getAccessToken().catch(console.error);
