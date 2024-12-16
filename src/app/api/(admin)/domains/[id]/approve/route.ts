import { NextRequest, NextResponse } from 'next/server';
import { Domain } from '@/model/domain.Model'
import dbConnect from '@/lib/dbConnect';
import axios from 'axios';

export async function PUT(request: NextRequest, { params }) {
    const { id } = params;
    await dbConnect();
    try {
        const domain = await Domain.findById(id);

        if (!domain) {
            return res.status(404).json({ message: 'Domain not found' });
        }

        // Call DataforSEO API
        const response = await axios.post(
            'https://api.dataforseo.com/v3/on_page/task_post',
            [
                {
                    target: domain.domain,
                    max_crawl_pages: 10,
                    load_resources: true,
                    enable_javascript: true,
                    enable_browser_rendering: true
                }
            ],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const taskId = response.data.tasks[0].id;

        // Update domain with approval and taskId
        domain.isApproved = true;
        domain.taskId = taskId;
        await domain.save();

        return NextResponse.json(domain);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}