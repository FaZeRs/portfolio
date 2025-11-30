import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { ValidationErrorMap } from "@tanstack/react-form";
import { Image } from "@unpic/react";
import { useState } from "react";
import { MAX_IMAGE_SIZE, VALID_IMAGE_TYPES } from "~/lib/constants";

type FormField = {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
  handleBlur?: () => void;
};

type FormImageUploadProps = {
  field: FormField;
  name: string;
  label: string;
  initialPreview?: string | null;
  className?: string;
};

export function FormImageUpload({
  field,
  name,
  label,
  initialPreview,
  className,
}: Readonly<FormImageUploadProps>) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialPreview ?? null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      field.setErrorMap({
        onChange: [
          {
            message: "Please upload a valid image (JPEG, PNG, GIF, WebP, AVIF)",
          },
        ],
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      field.setErrorMap({
        onChange: [
          {
            message: "Image size must be less than 5MB",
          },
        ],
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];

        field.handleChange(base64Data ?? "");
        setPreviewImage(base64String);
      };
      reader.onerror = () => {
        field.setErrorMap({
          onChange: [
            {
              message: "Error reading file",
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    } catch (_error) {
      field.setErrorMap({
        onChange: [
          {
            message: "Failed to process image",
          },
        ],
      });
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    field.handleChange("");
  };

  return (
    <div className={className}>
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <Input
            accept={VALID_IMAGE_TYPES.join(",")}
            aria-describedby="file-input-help"
            className="cursor-pointer"
            id={name}
            name={name}
            onBlur={field.handleBlur}
            onChange={handleFileChange}
            type="file"
          />
          <p className="text-muted-foreground text-xs" id="file-input-help">
            Accepted formats: JPEG, PNG, GIF, WebP, AVIF. Max size: 5MB
          </p>
        </div>
        {previewImage && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative h-32 w-full max-w-md overflow-hidden rounded-md border border-input">
              <Image
                alt="Preview"
                className="h-full w-full object-cover"
                height={128}
                src={previewImage}
                width={128}
              />
            </div>
            <Button
              aria-label="Remove image"
              onClick={handleRemoveImage}
              size="sm"
              type="button"
              variant="destructive"
            >
              Remove Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
