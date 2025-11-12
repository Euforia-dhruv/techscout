import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export default function BuildGuide() {
  const sections = [
    {
      id: "planning",
      title: "Planning Your Build",
      icon: Lightbulb,
      content: [
        {
          subtitle: "Determine Your Budget",
          text: "Start by setting a realistic budget. Entry-level builds start around $600-800, mid-range builds $1000-1500, and high-end builds $2000+. Remember to account for peripherals (monitor, keyboard, mouse) if needed.",
        },
        {
          subtitle: "Define Your Use Case",
          text: "Different tasks require different components. Gaming prioritizes GPU power, content creation needs strong CPU and RAM, while general use can work with balanced mid-range components.",
        },
      ],
    },
    {
      id: "components",
      title: "Component Selection Guide",
      icon: CheckCircle2,
      content: [
        {
          subtitle: "CPU (Processor)",
          text: "The brain of your computer. Intel and AMD are the main manufacturers. For gaming, focus on single-core performance. For productivity, prioritize core count. Ensure socket compatibility with your motherboard.",
        },
        {
          subtitle: "GPU (Graphics Card)",
          text: "Essential for gaming and visual work. NVIDIA and AMD are the primary options. Consider VRAM (8GB+ for modern gaming), power requirements, and physical size to ensure case compatibility.",
        },
        {
          subtitle: "Motherboard",
          text: "Connects all components. Must match your CPU socket (Intel: LGA1700, AMD: AM5/AM4). Consider RAM slots, M.2 slots for storage, and expansion capabilities.",
        },
        {
          subtitle: "RAM (Memory)",
          text: "16GB is the minimum for gaming, 32GB recommended for content creation. DDR5 is newer but DDR4 is more affordable. Ensure compatibility with your motherboard.",
        },
        {
          subtitle: "Storage",
          text: "NVMe SSDs offer the fastest speeds for your OS and games. Consider a 500GB-1TB NVMe for boot drive and a larger SATA SSD or HDD for mass storage.",
        },
        {
          subtitle: "PSU (Power Supply)",
          text: "Don't cheap out here. Use our power calculator or aim for 20-30% headroom above estimated consumption. Look for 80+ Bronze minimum, Gold for better efficiency.",
        },
        {
          subtitle: "Case",
          text: "Ensure it fits your motherboard form factor (ATX, Micro-ATX, Mini-ITX) and GPU length. Good airflow is essential. Consider cable management features.",
        },
        {
          subtitle: "Cooling",
          text: "Stock coolers work for non-overclocked builds. Aftermarket air or AIO liquid coolers provide better performance and quieter operation.",
        },
      ],
    },
    {
      id: "compatibility",
      title: "Compatibility Checklist",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Critical Compatibility Checks",
          text: "• CPU socket must match motherboard\n• RAM type (DDR4/DDR5) must match motherboard\n• GPU must fit in case (check length and clearance)\n• PSU wattage must exceed total system power consumption\n• Motherboard form factor must fit in case\n• CPU cooler height must fit in case",
        },
      ],
    },
    {
      id: "assembly",
      title: "Assembly Steps",
      icon: CheckCircle2,
      content: [
        {
          subtitle: "Before You Start",
          text: "Work on a non-static surface, gather your tools (screwdriver, zip ties), and read all manuals. Ground yourself to prevent static discharge.",
        },
        {
          subtitle: "Installation Order",
          text: "1. Install PSU in case\n2. Install I/O shield and motherboard standoffs\n3. Install CPU and cooler on motherboard (outside case)\n4. Install RAM\n5. Place motherboard in case\n6. Install storage drives\n7. Install GPU\n8. Connect all power cables\n9. Connect front panel connectors\n10. Cable management",
        },
        {
          subtitle: "First Boot",
          text: "Double-check all connections, especially the 24-pin motherboard power and 8-pin CPU power. Turn on PSU switch, then press the case power button. If it doesn't boot, check power connections and RAM seating.",
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Common Issues",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "PC Won't Turn On",
          text: "Check PSU switch, verify all power connections (24-pin, 8-pin CPU), ensure RAM is fully seated, and confirm front panel power button is connected correctly.",
        },
        {
          subtitle: "No Display Output",
          text: "Ensure monitor is connected to GPU (not motherboard if GPU is installed), verify GPU is fully seated with power cables connected, and try reseating RAM.",
        },
        {
          subtitle: "Overheating",
          text: "Verify cooler is properly mounted with thermal paste, check that all fans are running, ensure adequate case ventilation, and remove any plastic film from cooler base.",
        },
      ],
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">PC Building Guide</h1>
        <p className="text-muted-foreground">
          Complete guide to building your first PC from planning to troubleshooting
        </p>
      </div>

      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Use our PC Builder tool to ensure all your components are compatible before purchasing. 
              It will automatically check for socket compatibility, power requirements, and physical clearances.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline" data-testid={`accordion-${section.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-semibold text-left">
                      {idx + 1}. {section.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-6">
                    {section.content.map((item, itemIdx) => (
                      <div key={itemIdx} className="space-y-2">
                        <h3 className="font-semibold text-base">{item.subtitle}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge>Video</Badge>
              <div>
                <p className="font-medium">Step-by-Step Build Tutorials</p>
                <p className="text-sm text-muted-foreground">Watch detailed video guides for first-time builders</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge>Tools</Badge>
              <div>
                <p className="font-medium">Compatibility Checker</p>
                <p className="text-sm text-muted-foreground">Use our PC Builder for real-time compatibility validation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge>Community</Badge>
              <div>
                <p className="font-medium">Build Showcase</p>
                <p className="text-sm text-muted-foreground">Get inspired by builds from our community</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
