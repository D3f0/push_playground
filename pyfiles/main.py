# encoding: utf-8
from PyQt4.QtGui import *
from PyQt4.QtCore import *
import sys
try:
    import zmq
except ImportError:
    print "Este ejemplo necesita ZMQ"
    sys.exit(-1)
    
    
ADDR = 'tcp://127.0.0.1:2345'

class Ventana(QMainWindow):
    
    def __init__(self):
        super(Ventana, self).__init__()
        self.setupUi()
        self.setupSignals()
        self.setupCommunication()
        self.setWindowTitle("Python + ZMQ + node.js + socket.io")
    def setupUi(self):
        '''
        Generar el layout gráfico del widget
        '''
        centralWdiget = QWidget()
        layout = QVBoxLayout()
        centralWdiget.setLayout(layout)
        layout.addWidget(QLabel("<b>Probando ZMQ</b>"))
        self.slider = QSlider(Qt.Horizontal)
        self.slider.setObjectName("slider")
        layout.addWidget(self.slider)
        self.lcd = QLCDNumber(3)
        layout.addWidget(self.lcd)
        self.spin = QSpinBox()
        layout.addWidget(self.spin)
        self.statusBar().showMessage("zmq.PUSH (NOWAIT) on %s" % ADDR)
        self.button = QPushButton("New Browser")
        layout.addWidget(self.button)
        self.setCentralWidget(centralWdiget)

    
    def setupSignals(self):
        self.slider.valueChanged.connect(self.valueChanged)
        self.spin.valueChanged.connect(self.valueChanged)
        self.button.pressed.connect(self.lanuchBrowser)
        
    def valueChanged(self, value):
        self.lcd.display(value)
        self.spin.setValue(value)
        self.slider.setValue(value)
        print "Sending value", value
        try:
            self.sock.send_json({
                             'value_update': value}, zmq.NOBLOCK)
        except zmq.ZMQError as e:
            pass # Can't be delivered
        
    def lanuchBrowser(self):    
        import webbrowser
        webbrowser.open_new('http://localhost:8080')
    
    def setupCommunication(self):
        context = zmq.Context()
        self.sock = context.socket(zmq.PUSH)
        self.sock.bind(ADDR)
    
def main(argv=sys.argv):
    app = QApplication(argv)
    v = Ventana()
    v.show()
    return app.exec_()


if __name__ == '__main__':
    sys.exit(main())