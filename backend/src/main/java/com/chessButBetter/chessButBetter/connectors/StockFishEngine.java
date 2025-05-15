package com.chessButBetter.chessButBetter.connectors;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import org.springframework.stereotype.Component;

@Component
public class StockFishEngine {
    private Process process;
    private BufferedWriter writer;
    private BufferedReader reader;

    public boolean start(String stockfishPath) {
        try {
            ProcessBuilder builder = new ProcessBuilder(stockfishPath);
            process = builder.start();
            writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
            reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public void sendCommand(String command) throws IOException {
        writer.write(command + "\n");
        writer.flush();
    }

    public String readUntil(String keyword) throws IOException {
        String line;
        StringBuilder output = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
            if (line.contains(keyword)) {
                break;
            }
        }
        return output.toString();
    }

    public String getBestMove(String position, int movetime) throws IOException {
        sendCommand("position startpos moves " + position);
        sendCommand("go movetime " + movetime);
        return readUntil("bestmove");
    }

    public void stop() throws IOException {
        sendCommand("quit");
        process.destroy();
    }
}