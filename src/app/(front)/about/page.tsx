import Link from "next/link";
import AppLoading from "../components/app-loading";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info, Rocket, Cpu } from "lucide-react";

async function ApiVersion() {
  try {
    const response = await fetch('https://api.codingthailand.com/api/version');
    const apiInfo = await response.json();
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Cpu className="size-4" />
        <span>API Version: <span className="font-mono font-semibold text-foreground">{apiInfo.data.version}</span></span>
      </div>
    );
  } catch (error) {
    return <p className="text-sm text-destructive">Unable to load API version</p>;
  }
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-12 md:py-24">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
            About Us
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-6">
            Empowering Developers <br className="hidden md:block" /> 
            with Better Tools
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground mb-8">
            We are dedicated to building a robust ecosystem that simplifies the 
            software development process, allowing you to focus on what truly 
            matters: creating exceptional user experiences.
          </p>
          <Button asChild variant="outline" className="rounded-full group">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-8 rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 p-3 rounded-2xl bg-primary/10 w-fit">
              <Rocket className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To accelerate the journey from idea to production by providing 
              high-quality starters and reusable components.
            </p>
          </div>

          <div className="p-8 rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 p-3 rounded-2xl bg-primary/10 w-fit">
              <Info className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p className="text-muted-foreground">
              Becoming the gold standard for Next.js application starters 
              with integrated authentication and database patterns.
            </p>
          </div>

          <div className="p-8 rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <div className="mb-4 p-3 rounded-2xl bg-primary/10 w-fit">
              <Cpu className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">System Status</h3>
            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
              <Suspense fallback={<AppLoading />}>
                <ApiVersion />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
