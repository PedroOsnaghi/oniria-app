export type DreamAPIResponse = {
    title: string;
    description: string;
    interpretation: string;
    emotion: string;
};

export class DreamsService {

    constructor() {
    }

    async fetchDreamInterpretation(description: string): Promise<DreamAPIResponse> {
        const response = await fetch('http://localhost:3000/api/dreams/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching dream interpretation: ${response.statusText}`);
        }

        const data: DreamAPIResponse = await response.json();
        return data;
    }


}