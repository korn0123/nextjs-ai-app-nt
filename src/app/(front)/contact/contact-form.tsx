"use client"

import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Phone, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "เกิดข้อผิดพลาดในการส่งข้อความ")
        }

        toast.success("ส่งข้อความสำเร็จ!")
        setIsSubmitted(true)
        form.reset()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งข้อความ"
        toast.error(errorMessage)
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-16 px-8 rounded-3xl bg-white/65 backdrop-blur-xl border border-white/30 shadow-glass max-w-2xl mx-auto">
        <CheckCircle className="h-16 w-16 text-primary" />
        <div className="space-y-3">
          <h3 className="text-3xl font-bold font-poppins">ส่งข้อความสำเร็จ!</h3>
          <p className="text-muted-foreground text-lg font-dm-sans">
            เราได้รับข้อมูลของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsSubmitted(false)}
          className="mt-4 rounded-lg px-8 py-6 font-bold hover:bg-primary hover:text-white transition-colors"
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-16">
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Mail className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-dm-sans">Email</p>
              <p className="text-lg font-semibold font-poppins">contact@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Phone className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-dm-sans">เบอร์โทรศัพท์</p>
              <p className="text-lg font-semibold font-poppins">02-XXX-XXXX</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-3 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-dm-sans">เวลาทำการ</p>
              <p className="text-lg font-semibold font-poppins">จันทร์ - ศุกร์: 09:00 - 18:00 น.</p>
            </div>
          </div>
        </div>
        <Separator className="opacity-50" />
        <p className="text-muted-foreground text-base font-dm-sans leading-relaxed">
          หากคุณมีคำถามเพิ่มเติม หรือต้องการขอใบเสนอราคา 
          สามารถติดต่อเราผ่านแบบฟอร์มด้านข้างได้ทันที
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white/65 backdrop-blur-xl border border-white/30 shadow-glass transition-transform duration-300 hover:scale-[1.02]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold font-poppins">ชื่อ</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="กรอกชื่อของคุณ" 
                      {...field} 
                      className="h-12 rounded-lg border-gray-200 focus:ring-blue-600 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold font-poppins">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="example@email.com" 
                      {...field} 
                      className="h-12 rounded-lg border-gray-200 focus:ring-blue-600 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold font-poppins">ข้อความ</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={5} 
                      placeholder="พิมพ์ข้อความที่ต้องการ..." 
                      {...field} 
                      className="rounded-lg border-gray-200 focus:ring-blue-600 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg font-bold text-base transition-all hover:scale-105 active:scale-95" 
              disabled={isPending}
            >
              {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
