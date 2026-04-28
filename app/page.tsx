"use client"

import { AppShell } from "@/components/layout/app-shell"
import { HeroSection } from "@/components/home/hero-section"
import { ModuleCards } from "@/components/home/module-cards"

export default function HomePage() {
  return (
    <AppShell>
      <div className="min-h-screen">
        <HeroSection />
        <ModuleCards />
      </div>
    </AppShell>
  )
}
