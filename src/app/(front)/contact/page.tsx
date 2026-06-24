import ContactForm from "./contact-form"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-16 space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter md:text-7xl font-poppins text-foreground">
            Let&apos;s <span className="text-primary">Connect.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-dm-sans">
            มีคำถามหรือข้อสงสัยประการใด สามารถติดต่อเราได้ผ่านทาง 
            แบบฟอร์มด้านล่าง หรือข้อมูลการติดต่อทางด้านซ้าย
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
