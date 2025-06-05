export async function purgeData(data: any[]) {
  try {
    const response = await fetch(
      'https://coral-app-2-j6yru.ondigitalocean.app/score',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const json = await response.json();

    if (json) return json;
  } catch (error) {
    console.error('Error al procesar los datos:', error);
    return null;
  }
}
