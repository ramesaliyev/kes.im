export async function validateToken(token, event) {
  // Short circuit.
  if (!token) return false;
  
  const {headers} = event.request;
  const ip = headers.get('CF-Connecting-IP');

	const result = await fetch(CF_TURNSTILE_VERIFY_URL, {
		body: JSON.stringify({
			secret: TURNSTILE_SECRET,
			response: token,
			remoteip: ip
		}),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const outcome = await result.json();

  if (outcome.hostname !== 'kes.im') {
    return false;
  }

	return outcome.success;
}
