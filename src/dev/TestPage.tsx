import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code2, FileText, TestTube, Zap } from "lucide-react";
import ProposalCoverPageDemo from "./components/ProposalCoverPageDemo";

const TestPage = () => {
  const [activeTest, setActiveTest] = useState("cover-page");

  const tests = [
    {
      id: "cover-page",
      title: "Capa da Proposta",
      description: "Teste da capa da proposta com dados mockados",
      icon: FileText,
      component: <ProposalCoverPageDemo />
    },
    // Adicione mais testes aqui conforme necessário
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 p-6">
      <div className="max-w-screen-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-xl shadow-lg">
              <TestTube className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                Página de Testes
                <Badge className="bg-secondary text-primary hover:bg-secondary/90">
                  Desenvolvimento
                </Badge>
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Componentes de teste e demonstração - Olimpo Solar
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Tabs value={activeTest} onValueChange={setActiveTest} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 h-auto p-2 bg-card">
            {tests.map((test) => {
              const IconComponent = test.icon;
              return (
                <TabsTrigger
                  key={test.id}
                  value={test.id}
                  className="flex items-center gap-2 p-4 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <IconComponent className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{test.title}</div>
                    <div className="text-xs opacity-70">{test.description}</div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Content */}
          {tests.map((test) => (
            <TabsContent key={test.id} value={test.id} className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <test.icon className="h-5 w-5 text-primary" />
                    {test.title}
                    <Badge variant="outline" className="ml-auto">
                      <Code2 className="h-3 w-3 mr-1" />
                      Teste
                    </Badge>
                  </CardTitle>
                  <p className="text-muted-foreground">{test.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg bg-background/50 p-4">
                    {test.component}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <Card className="border-dashed border-muted">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Adicione novos testes aqui</p>
              <p className="text-sm">
                Edite o arquivo <code className="bg-muted px-2 py-1 rounded text-xs">src/dev/TestPage.tsx</code> para adicionar mais componentes de teste
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
