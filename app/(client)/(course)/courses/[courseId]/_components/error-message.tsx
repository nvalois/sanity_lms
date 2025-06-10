import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({
    message
}: ErrorMessageProps) => {
    return (
        <div className="flex items-center gap-x-2 text-destructive bg-destructive/15 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">
                {message}
            </p>
        </div>
    )
} 