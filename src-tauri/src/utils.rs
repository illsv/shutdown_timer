pub mod shutdown_command {
    use std::env;
    use std::process::{ Command, Stdio };

    const SHUTDOWN_OPTION: &str = "shutdown";
    const REBOOT_OPTION: &str = "reboot";
    const SLEEP_OPTION: &str = "sleep";

    const ZERO_TIME_ARG_NIX: &str = "now";

    fn call_shutdown_command(args: [&str; 3]) {
        // build command
        let mut binding = Command::new("shutdown");
        let command = binding.arg(args[0]).arg(args[1]);

        // add 3rd arg if present
        if args[2] != "" {
            command.arg(args[2]);
        }

        // Tell the OS to record the command's output
        let output = command
            .stdout(Stdio::piped())
            // execute the command, wait for it to complete, then capture the output
            .output()
            // Blow up if the OS was unable to start the program
            .unwrap();

        // extract the raw bytes that we captured and interpret them as a string
        let stdout = String::from_utf8(output.stdout).unwrap();

        println!("{}", stdout);
    }

    // rundll32.exe powrprof.dll, SetSuspendState Sleep
    fn call_win_sleep_command() {
        let output = Command::new("rundll32.exe")
            .arg("powrprof.dll,")
            .arg("SetSuspendState")
            .arg("Sleep")
            .stdout(Stdio::piped())
            .output()
            .unwrap();

        let stdout = String::from_utf8(output.stdout).unwrap();
        println!("{}", stdout);
    }

    // macOs:
    // sudo shutdown -h +60
    // instead of time can specify now
    // sudo shutdown -s now

    // -h to shutdown, -s sleep, -r reboot
    fn shutdown_mac(mode: &str) {
        let mode_arg: &str = match mode {
            SHUTDOWN_OPTION => "-h",
            REBOOT_OPTION => "-r",
            SLEEP_OPTION => "-s",
            _ => "-s",
        };

        call_shutdown_command([mode_arg, ZERO_TIME_ARG_NIX, ""])
    }

    // ubuntu:
    // sudo shutdown -s now

    // instead of time can specify now
    // -H shutdown, -h sleep, -r reboot
    fn shutdown_linux(mode: &str) {
        let mode_arg: &str = match mode {
            SHUTDOWN_OPTION => "-H",
            REBOOT_OPTION => "-r",
            SLEEP_OPTION => "-h",
            _ => "-s",
        };

        call_shutdown_command([mode_arg, ZERO_TIME_ARG_NIX, ""])
    }

    // win
    // sudo shutdown /h /t 0

    // /s to shutdown, /r reboot
    // and for sleep there is another command:
    // rundll32.exe powrprof.dll, SetSuspendState Sleep
    fn shutdown_win(mode: &str) {
        if mode == SLEEP_OPTION {
            call_win_sleep_command();
        } else {
            let mode_arg: &str = match mode {
                SHUTDOWN_OPTION => "/s",
                REBOOT_OPTION => "/r",
                _ => "/s",
            };

            call_shutdown_command([mode_arg, "/t", "0"])
        }
    }

    pub fn shutdown_resolver(mode: &str) {
        match env::consts::OS {
            "macos" => shutdown_mac(mode),
            "windows" => shutdown_win(mode),
            "linux" => shutdown_linux(mode),
            _ => shutdown_linux(mode),
        };
    }
}
