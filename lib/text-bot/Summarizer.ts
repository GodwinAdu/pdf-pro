"use server"
export async function summarizeText(text: string) {
    console.log(text);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STUDIO_API_KEY}`
        },
        body: JSON.stringify({
            source: text,
            sourceType: 'TEXT'
        })
    };

    try {
        const response = await fetch('https://api.ai21.com/studio/v1/summarize', requestOptions);

        if (!response.ok) {
            console.error('Request failed with status:', response.status);
            return null;
        }

        const responseData = await response.json(); // Parse response JSON
        console.log('Response:', responseData); // Log the response data
        return responseData;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
