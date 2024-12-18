"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button, Field, Input, Label, Textarea } from '@headlessui/react';
import clsx from 'clsx';
import { dominSchema } from "@/schemas/dominSchema";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from 'usehooks-ts';
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const DominForm = () => {
    const { user } = useUser();
    const [domin, setDomin] = useState('');
    const [dominMessage, setDominMessage] = useState('');
    const [isChackingDomin, setIsChackingDomin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [keywordInput, setKeywordInput] = useState('');
    const router = useRouter();


    const registerForm = useForm<z.infer<typeof dominSchema>>({
        resolver: zodResolver(dominSchema),
        defaultValues: {
            domain: "",
            workDescription: "",
            keywords: [],
        },
    });

    const { control, handleSubmit, reset, formState: { errors } } = registerForm;
    const { fields, append, remove } = useFieldArray<z.infer<typeof dominSchema>>({
        control,
        name: "keywords" as const,
    });

    const checkDominUnique = useDebounceCallback(async (value: string) => {
        if (value) {
            setIsChackingDomin(true);
            setDominMessage('');
            try {
                const response = await axios.get(`/api/check-domain-unique?domain=${encodeURIComponent(value)}`);
                if (response.data.success) {
                    setDominMessage(response.data.message);
                } else {
                    setDominMessage(response.data.message || 'Domain is not available');
                }
            } catch (error) {
                console.error("Error checking domin uniqueness:", error);
                const axiosError = error as AxiosError<ApiResponse>;
                setDominMessage(axiosError.response?.data.message || 'Error checking domain');
            } finally {
                setIsChackingDomin(false);
            }
        }
    }, 300);

    const onSubmit = async (data: z.infer<typeof dominSchema>) => {
        setIsSubmitting(true);
        try {
            const submissionData = {
                ...data,
                userId: user?.id,
            };

            const response = await axios.post<ApiResponse>('/api/domain', submissionData);
            if (response.status === 200) {
                reset();
                setDomin('');
                setDominMessage('');
                setKeywordInput('');
                const successMessage = response.data.message || 'Data added successfully';
                alert(successMessage);                
                router.push('/dashboard')
                
            }

        } catch (error) {
            console.error("Error in form submission:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage: string = axiosError.response?.data.message || 'Error adding data';
            setDominMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleAddKeyword = () => {
  if (keywordInput.trim()) {
    append({ value: keywordInput.trim() });
    setKeywordInput('');
  }
};

    return (
        <div className="flex flex-col gap-5 md:items-center">
            <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-wider lg:text-4xl mb-4">
                        Add your keywords
                    </h1>
                    <p className="mb-2 tracking-widest">
                        to start keyword optimization
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5 tracking-wide">
                    <Field className='flex flex-col space-y-2'>
                        <Label className="text-sm/5 font-medium">
                            Domin
                        </Label>
                        <Input
                            type='url'
                            placeholder="https://example.com"
                            {...registerForm.register("domain")}
                            onChange={(e) => {
                                const value = e.target.value;
                                registerForm.setValue("domain", value);
                                setDomin(value);
                                checkDominUnique(value);
                            }}
                            className={clsx(
                                'block w-full rounded-lg border border-transparent shadow ring-1 ring-black/10',
                                'px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 sm:text-sm/6',
                                'data-[focus]:outline data-[focus]:outline- 2 data-[focus]:-outline-offset-1 data-[focus]:outline-black'
                            )}
                        />
                        {isChackingDomin && <Loader2 className="animate-spin" />}
                        {dominMessage && <p className={`text-sm ${dominMessage === "Domain is available" ? 'text-green-500' : 'text-red-500'}`}>
                            {dominMessage}
                        </p>}
                    </Field>
                    <Field className='flex flex-col space-y-2'>
                        <Label className="text-sm/5 font-medium">
                            Work Description
                        </Label>
                        <Textarea
                            placeholder="Enter your work description"
                            {...registerForm.register("workDescription")}
                            className={clsx(
                                'block w-full rounded-lg border border-transparent shadow ring-1 ring-black/10', 'px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 sm:text-sm/6',
                                'data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black'
                            )}
                        />
                    </Field>
                    <Field className='flex flex-col space-y-2'>
                        <Label className="text-sm/5 font-medium">
                            Keywords
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type='text'
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                placeholder="Add a keyword"
                                className={clsx(
                                    'block w-full rounded-lg border border-transparent shadow ring-1 ring-black/10',
                                    'px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 sm:text-sm/6',
                                    'data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black'
                                )}
                            />
                            <Button type="button" onClick={handleAddKeyword} className="bg-neutral-950 text-white rounded-full px-2">
                                +
                            </Button>
                        </div>
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center">
                                        <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                            {field.value}
                                        </span>
                                        <Button type="button" onClick={() => remove(index)} className="text-xl">
                                            -
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Field>

                    {Object.keys(errors).length > 0 && (
                        <div className="text-red-500">
                            {Object.entries(errors).map(([key, error]) => (
                                <p key={key}>{error.message}</p>
                            ))}
                        </div>
                    )}

                    <Button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0} onClick={() => console.log("Submit button clicked")} className="rounded w-1/2 self-center bg-neutral-950 py-2 px-4 text-md text-white data-[hover]:bg-neutral-800 data-[active]:bg-sky-700">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            </>
                        ) : ("Submit")}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default DominForm;