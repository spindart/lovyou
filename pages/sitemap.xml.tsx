import { GetServerSideProps } from 'next';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function generateSiteMap(urls: string[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>https://lovyou.xyz</loc>
         <priority>1.0</priority>
         <changefreq>daily</changefreq>
       </url>
       ${urls
         .map((url) => `
       <url>
           <loc>https://lovyou.xyz/${url}</loc>
           <priority>0.8</priority>
           <changefreq>weekly</changefreq>
       </url>
     `).join('')}
     </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const sitesRef = collection(db, 'sites');
        const siteSnapshot = await getDocs(sitesRef);
        const urls = siteSnapshot.docs.map(doc => doc.id);

        const sitemap = generateSiteMap(urls);

        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 1 day
        res.write(sitemap);
        res.end();

        return { props: {} };
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.statusCode = 500;
        res.end('Error generating sitemap');
        return { props: {} };
    }
};

// Este componente não será usado, mas é necessário para o Next.js
const Sitemap = () => null;
export default Sitemap;