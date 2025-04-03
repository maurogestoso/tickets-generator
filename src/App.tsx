import { useState } from "react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { TypographyH1 } from "./components/ui/typography-h1";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="mx-auto h-screen max-w-2xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <TypographyH1>Hello</TypographyH1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span>
                Count: <Badge className="font-mono">{count}</Badge>
              </span>
              <Button onClick={() => setCount(count + 1)}>+</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default App;
