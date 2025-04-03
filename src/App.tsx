import { TypographyH1 } from "./components/ui/typography";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useCanvas } from "./lib/canvas";

function App() {
  const { canvasRef, img, loadImage, textLabels } = useCanvas();

  return (
    <>
      <header className="mx-auto mb-4 max-w-[90%] py-4">
        <TypographyH1>Tickets Generator</TypographyH1>
      </header>
      <main className="mx-auto flex max-w-[90%] justify-center gap-8">
        {img ? (
          <canvas width={600} height={400} ref={canvasRef} />
        ) : (
          <Card className="flex h-[400px] w-[600px] items-center justify-center self-stretch">
            <CardContent>
              <Input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={loadImage}
              />
            </CardContent>
          </Card>
        )}
        {img && (
          <Card className="w-[400px]">
            <CardContent>
              <Button className="mb-4" onClick={textLabels.actions.addNewLabel}>
                Add text label
              </Button>
              {textLabels.state.map((label, i) => (
                <div className="mb-4">
                  <p className="mb-2 font-bold">{label.name}</p>
                  <Input
                    type="text"
                    value={label.text}
                    onChange={(e) => {
                      textLabels.actions.editLabelText({
                        index: i,
                        text: e.target.value,
                      });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

export default App;
