"use client";

import * as z from "zod";
import { CardWrapper } from "./card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with OAuth Provider" : ""

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");


    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    // server actions
    const onSubmit = (values : z.infer<typeof LoginSchema>) => {
        startTransition(() => {
             login(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success)
             })
        })
       
    }
    
    return (
        <CardWrapper 
            headerLabel={"Welcome back"} 
            backButtonLabel={"Don't have an account"} 
            backButtonHref={"/auth/register"} 
            showSocial>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control} name="email" render={({field}) =>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field} placeholder="john.doe@example.com" type="email" disabled={isPending}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="password" render={({field}) =>(
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field} placeholder="*******" type="password" disabled={isPending}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

