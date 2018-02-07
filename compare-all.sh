 node compare BlackIronHack-Phase1
node compare BlackIronHack-Phase2 >> logs/BlackIronHack-Phase2.txt
node compare BlackIronHack-Phase3 >> logs/BlackIronHack-Phase3.txt
node compare BlackIronHack-Phase4 >> logs/BlackIronHack-Phase4.txt

node compare GoldIronHack-Phase1 >> logs/GoldIronHack-Phase1.txt
node compare GoldIronHack-Phase2 >> logs/GoldIronHack-Phase2.txt
node compare GoldIronHack-Phase3 >> logs/GoldIronHack-Phase3.txt
node compare GoldIronHack-Phase4 >> logs/GoldIronHack-Phase4.txt

node compare GreenIronHack-Phase1 >> logs/GreenIronHack-Phase1.txt
node compare GreenIronHack-Phase2 >> logs/GreenIronHack-Phase2.txt
node compare GreenIronHack-Phase3 >> logs/GreenIronHack-Phase3.txt
node compare GreenIronHack-Phase4 >> logs/GreenIronHack-Phase4.txt

node compare BlackIronHack-Phase1 --no-colors >> logs/BlackIronHack-Phase1-no-colors.txt
node compare BlackIronHack-Phase2 --no-colors >> logs/BlackIronHack-Phase2-no-colors.txt
node compare BlackIronHack-Phase3 --no-colors >> logs/BlackIronHack-Phase3-no-colors.txt
node compare BlackIronHack-Phase4 --no-colors >> logs/BlackIronHack-Phase4-no-colors.txt

node compare GoldIronHack-Phase1 --no-colors >> logs/GoldIronHack-Phase1-no-colors.txt
node compare GoldIronHack-Phase2 --no-colors >> logs/GoldIronHack-Phase2-no-colors.txt
node compare GoldIronHack-Phase3 --no-colors >> logs/GoldIronHack-Phase3-no-colors.txt
node compare GoldIronHack-Phase4 --no-colors >> logs/GoldIronHack-Phase4-no-colors.txt

node compare GreenIronHack-Phase1 --no-colors >> logs/GreenIronHack-Phase1-no-colors.txt
node compare GreenIronHack-Phase2 --no-colors >> logs/GreenIronHack-Phase2-no-colors.txt
node compare GreenIronHack-Phase3 --no-colors >> logs/GreenIronHack-Phase3-no-colors.txt
node compare GreenIronHack-Phase4 --no-colors >> logs/GreenIronHack-Phase4-no-colors.txt

node compare BlackIronHack-Phase1 BlackIronHack-Phase2 >> "logs/BlackIronHack-Phase1+BlackIronHack-Phase2"
node compare BlackIronHack-Phase2 BlackIronHack-Phase3 >> "logs/BlackIronHack-Phase2+BlackIronHack-Phase3"
node compare BlackIronHack-Phase3 BlackIronHack-Phase4 >> "logs/BlackIronHack-Phase3+BlackIronHack-Phase4"

node compare GoldIronHack-Phase1 GoldIronHack-Phase2 >> "logs/GoldIronHack-Phase1+GoldIronHack-Phase2"
node compare GoldIronHack-Phase2 GoldIronHack-Phase3 >> "logs/GoldIronHack-Phase2+GoldIronHack-Phase3"
node compare GoldIronHack-Phase3 GoldIronHack-Phase4 >> "logs/GoldIronHack-Phase3+GoldIronHack-Phase4"

node compare GreenIronHack-Phase1 GreenIronHack-Phase2 >> "logs/GreenIronHack-Phase1+GreenIronHack-Phase2"
node compare GreenIronHack-Phase2 GreenIronHack-Phase3 >> "logs/GreenIronHack-Phase2+GreenIronHack-Phase3"
node compare GreenIronHack-Phase3 GreenIronHack-Phase4 >> "logs/GreenIronHack-Phase3+GreenIronHack-Phase4"

node compare BlackIronHack-Phase1 BlackIronHack-Phase2 --no-colors >> "logs/BlackIronHack-Phase1+BlackIronHack-Phase2-no-colors.txt"
node compare BlackIronHack-Phase2 BlackIronHack-Phase3 --no-colors >> "logs/BlackIronHack-Phase2+BlackIronHack-Phase3-no-colors.txt"
node compare BlackIronHack-Phase3 BlackIronHack-Phase4 --no-colors >> "logs/BlackIronHack-Phase3+BlackIronHack-Phase4-no-colors.txt"

node compare GoldIronHack-Phase1 GoldIronHack-Phase2 --no-colors >> "logs/GoldIronHack-Phase1+GoldIronHack-Phase2-no-colors.txt"
node compare GoldIronHack-Phase2 GoldIronHack-Phase3 --no-colors >> "logs/GoldIronHack-Phase2+GoldIronHack-Phase3-no-colors.txt"
node compare GoldIronHack-Phase3 GoldIronHack-Phase4 --no-colors >> "logs/GoldIronHack-Phase3+GoldIronHack-Phase4-no-colors.txt"

node compare GreenIronHack-Phase1 GreenIronHack-Phase2 --no-colors >> "logs/GreenIronHack-Phase1+GreenIronHack-Phase2-no-colors.txt"
node compare GreenIronHack-Phase2 GreenIronHack-Phase3 --no-colors >> "logs/GreenIronHack-Phase2+GreenIronHack-Phase3-no-colors.txt"
node compare GreenIronHack-Phase3 GreenIronHack-Phase4 --no-colors >> "logs/GreenIronHack-Phase3+GreenIronHack-Phase4-no-colors.txt"
