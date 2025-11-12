import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import type { CompatibilityIssue } from "@shared/schema";

interface CompatibilityAlertProps {
  issue: CompatibilityIssue;
}

export function CompatibilityAlert({ issue }: CompatibilityAlertProps) {
  const config = {
    error: {
      icon: XCircle,
      className: "border-destructive/50 bg-destructive/10 text-destructive",
      iconClassName: "text-destructive",
    },
    warning: {
      icon: AlertTriangle,
      className: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      iconClassName: "text-yellow-600 dark:text-yellow-400",
    },
    info: {
      icon: Info,
      className: "border-primary/50 bg-primary/10 text-primary",
      iconClassName: "text-primary",
    },
  };

  const { icon: Icon, className, iconClassName } = config[issue.severity];

  return (
    <Alert className={className} data-testid={`alert-compatibility-${issue.severity}`}>
      <Icon className={`h-4 w-4 ${iconClassName}`} />
      <AlertDescription className="text-sm">
        <span className="font-medium">{issue.affectedComponents.join(", ")}: </span>
        {issue.message}
      </AlertDescription>
    </Alert>
  );
}

export function CompatibilitySuccess() {
  return (
    <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400" data-testid="alert-compatibility-success">
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="text-sm font-medium">
        All components are compatible!
      </AlertDescription>
    </Alert>
  );
}
