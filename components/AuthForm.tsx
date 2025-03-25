"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        toast.success("Sign up successful. Please sign in.");
        router.push("/sign-in");
        console.log(values);
      } else {
        toast.success("Sign in successful.");
        router.push("/");
        console.log(values);
      }
    } catch (error) {
      console.log(error);
      toast.error(`There is an error ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={32} height={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3 className="text-primary-100">
          Practice your interview skills with AI
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form"
          >
            {!isSignIn && (
              <FormField
                name="name"
                label="Name"
                control={form.control}
                type="text"
                placeholder="your name"
              />
            )}
            <FormField
              name="email"
              label="Email"
              control={form.control}
              type="email"
              placeholder="Email"
            />
            <FormField
              name="password"
              label="Password"
              control={form.control}
              type="password"
              placeholder="Password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create An Account"}
            </Button>
          </form>
        </Form>
        <p>
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1 "
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
