"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestBlood } from "@/server/request/request-blood";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const formSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  gender: z.enum(["Male", "Female", "Other"], "Gender is required"),
  bloodGroup: z.enum(bloodGroups, "Blood group is required"),
  age: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, "Age must be a valid number"),
  units: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1, "At least 1 unit is required"),
  location: z.string().min(2, "Address is required"),
  isCritical: z.boolean().default(false),
  notes: z.string().min(10, "Please provide some details about the request"),
});

export function RequestForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      phoneNumber: "",
      gender: undefined,
      bloodGroup: "",
      age: "",
      units: "",
      location: "",
      isCritical: false,
      notes: "",
    },
  });

  const mutation = useMutation<any, any, any>({
    mutationKey: ["requestBlood"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const result = await requestBlood({
        patientName: values.patientName,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        bloodGroup: values.bloodGroup,
        age: Number(values.age),
        units: Number(values.units),
        location: values.location,
        isCritical: values.isCritical,
        notes: values.notes,
        isAccepted: false,
      });

      if (!result.requestId) {
        throw new Error("Failed to submit request");
      }
      return result;
    },
    onSuccess: () => {
      form.reset();
      toast.success("Blood request submitted successfully");
      queryClient.refetchQueries({
        queryKey: ["myRequests"],
      });
      router.push("/request-blood/my-requests");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to submit the request");
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-6 w-full space-y-5"
      >
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-500 font-light">
                Patient Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter patient name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-500 font-light">
                Contact Number
              </FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter contact number"
                  defaultCountry="IN"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex-col gap-y-5 sm:flex-row flex justify-center items-center gap-x-2">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-neutral-500 font-light">
                  Patient Gender
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full" id="gender">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-neutral-500 font-light">
                  Required Blood Group
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full" id="blood">
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((item) => (
                        <SelectItem value={item} key={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex-col gap-y-5 sm:flex-row flex justify-center items-center gap-x-2">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-neutral-500 font-light">
                  Patient Age
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter patient age"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="units"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-neutral-500 font-light">
                  Units Required
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of units needed"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-500 font-light">
                Hospital/Location
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter hospital or location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isCritical"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <FormLabel className="text-neutral-500 font-light">
                  Critical Request
                </FormLabel>
                <div className="text-sm text-neutral-500 font-light">
                  Mark if this is an urgent/critical requirement
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={(val: any) => field.onChange(val)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-500 font-light">
                Additional Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide any additional details about the requirement"
                  className="placeholder:text-neutral-500 font-light"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="secondary"
          className="w-full"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader className="animate-spin" />
          ) : (
            "Submit Request"
          )}
        </Button>
      </form>
    </Form>
  );
}
