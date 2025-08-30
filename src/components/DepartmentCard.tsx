import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Department {
    name: string;
    description: string;
    icon: React.ComponentType<any>;
}

interface DepartmentCardProps {
    department: Department;
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
    const IconComponent = department.icon;
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border hover:border-primary/20 h-full">
            <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-primary/10  rounded-full flex items-center justify-center mb-4  group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {department.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {department.description}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
