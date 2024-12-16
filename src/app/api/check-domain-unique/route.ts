import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/model/domain.Model";
import { z } from "zod";
import { domainValidation } from "@/schemas/dominSchema";

const DomainQuerySchema = z.object({
    domain: domainValidation
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            domain: searchParams.get("domain")
        }

        // validate with zod
        const result = DomainQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const domainError = result.error.format().domain?._errors || []
            return Response.json(
                {
                    success: false,
                    message: domainError?.length > 0
                        ? domainError.join(', ')
                        : 'Invalid query parameters'
                },
                {
                    status: 400
                }
            )
        }

        const { domain } = result.data;

        const existingVerifiedUse = await Domain.findOne({ domain })
        if (existingVerifiedUse) {
            return Response.json(
                {
                    success: false,
                    message: "Domain already taken"
                },
                {
                    status: 400
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Domain is available"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("error checking domain", error);
        return Response.json(
            {
                success: false,
                message: "Error checking domain"
            },
            {
                status: 500
            }
        )
    }
}
