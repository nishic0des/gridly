import { headers } from "next/headers";

export function handleError(error, defaultMessage="An error occured"){
    // console.error(error);
    return new Response(
        JSON.stringify({
            error:error.message|| defaultMessage,
            details:process.env.NODE_ENV==="development" ? error.stack : undefined
        }),{
            status:error.status||500,
            headers:{
                'Content-Type': 'application/json',
            }
        }
    )
}