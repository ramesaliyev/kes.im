export default event => {
    event.respondWith(new Response('Hello this is API.', {status: 200}));
};